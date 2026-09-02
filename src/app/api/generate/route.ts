import { NextResponse } from "next/server";
import { getProvider } from "@/lib/ai/get-provider";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: Request) {
  const formData = await req.formData();

  const provider = formData.get("provider");
  const apiKey = formData.get("apiKey");
  const productName = formData.get("productName");
  const description = formData.get("description");
  const image = formData.get("productImage");

  if (
    typeof provider !== "string" ||
    typeof apiKey !== "string" ||
    typeof productName !== "string" ||
    !(image instanceof File)
  ) {
    return NextResponse.json(
      { error: "Missing required fields." },
      { status: 400 }
    );
  }

  if (!apiKey.trim()) {
    return NextResponse.json(
      { error: "No API key provided." },
      { status: 400 }
    );
  }

  try {
    const buffer = Buffer.from(await image.arrayBuffer());
    const aiProvider = getProvider(provider);

    // Reference images arrive as referenceImage0, referenceType0, ...
    const references: { base64: string; mimeType: string; type: string }[] = [];
    for (let i = 0; i < 3; i++) {
      const refFile = formData.get(`referenceImage${i}`);
      const refType = formData.get(`referenceType${i}`);
      if (refFile instanceof File) {
        const refBuffer = Buffer.from(await refFile.arrayBuffer());
        references.push({
          base64: refBuffer.toString("base64"),
          mimeType: refFile.type || "image/jpeg",
          type: typeof refType === "string" ? refType : "other",
        });
      }
    }

    const colorPaletteRaw = formData.get("colorPalette");
    const colorPalette =
      typeof colorPaletteRaw === "string" ? JSON.parse(colorPaletteRaw) : undefined;

    const fontFamily = formData.get("fontFamily");
    const fontWeight = formData.get("fontWeight");

    const result = await aiProvider.generate(
      {
        productImage: {
          base64: buffer.toString("base64"),
          mimeType: image.type || "image/jpeg",
        },
        references: references.length ? references : undefined,
        productName,
        description: typeof description === "string" ? description : undefined,
        creativeDirection: formData.get("creativeDirection")?.toString(),
        format: formData.get("format")?.toString(),
        headline: formData.get("headline")?.toString() || undefined,
        subheadline: formData.get("subheadline")?.toString() || undefined,
        cta: formData.get("cta")?.toString() || undefined,
        font:
          typeof fontFamily === "string" && typeof fontWeight === "string"
            ? { family: fontFamily, weight: fontWeight }
            : undefined,
        colorPalette,
      },
      apiKey
    );

    return NextResponse.json(result);
  } catch (err) {
    console.error("Generation failed:", err);
    const message =
      err instanceof Error ? err.message : "Generation failed unexpectedly.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}