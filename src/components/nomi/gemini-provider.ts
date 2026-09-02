import { GoogleGenAI } from "@google/genai";
import type { AIProvider, GenerationInput, GenerationResult } from "@/lib/ai/types";

const MODEL = "gemini-3.1-flash-image";

const DIRECTION_PHRASES: Record<string, string> = {
  auto: "a style that best fits the product",
  minimal: "a minimal, restrained, uncluttered style",
  editorial: "a sophisticated, magazine-editorial style",
  luxury: "a premium, luxury advertising style",
  bold: "a bold, high-impact advertising style",
};

const FORMAT_PHRASES: Record<string, string> = {
  square: "square 1:1 aspect ratio, suitable for Instagram feed",
  "portrait-4-5": "4:5 portrait aspect ratio",
  story: "9:16 vertical story format",
  other: "a standard advertising aspect ratio",
};

const CREATIVE_DIRECTIONS_FALLBACK = [
  "an editorial-style advertisement",
  "a lifestyle advertisement",
  "a clean product-first advertisement",
  "a bold campaign-style advertisement",
];

export class GeminiProvider implements AIProvider {
  async generate(
    input: GenerationInput,
    apiKey: string
  ): Promise<GenerationResult> {
    const ai = new GoogleGenAI({ apiKey });

    const directionPhrase =
      input.creativeDirection && input.creativeDirection !== "auto"
        ? DIRECTION_PHRASES[input.creativeDirection]
        : null;

    const formatPhrase = input.format
      ? FORMAT_PHRASES[input.format] ?? FORMAT_PHRASES.other
      : FORMAT_PHRASES["portrait-4-5"];

    const variants = directionPhrase
      ? [directionPhrase, directionPhrase, directionPhrase, directionPhrase]
      : CREATIVE_DIRECTIONS_FALLBACK;

    const requests = variants.map(async (variantPhrase) => {
      const promptParts = [
        `Create ${variantPhrase} for this product: "${input.productName}".`,
        input.description ? `Context: ${input.description}.` : "",
        `Use ${formatPhrase}.`,
        input.headline ? `Include this exact headline text: "${input.headline}".` : "",
        input.subheadline ? `Include this exact subheadline text: "${input.subheadline}".` : "",
        input.cta ? `Include this exact call-to-action text: "${input.cta}".` : "",
        input.font
          ? `Use typography in the style of ${input.font.family}, ${input.font.weight} weight.`
          : "",
        input.colorPalette?.mode === "custom" && input.colorPalette.colors.length
          ? `Favor this color palette: ${input.colorPalette.colors.join(", ")}.`
          : "",
        input.references?.length
          ? `Additional reference images are provided for brand/style/environment context — use them to inform mood and styling, but keep the main product from the primary photo.`
          : "",
        "Keep the product recognizable and true to the reference photo.",
      ]
        .filter(Boolean)
        .join(" ");

      const contents = [
        {
          inlineData: {
            mimeType: input.productImage.mimeType,
            data: input.productImage.base64,
          },
        },
        ...(input.references ?? []).map((ref) => ({
          inlineData: { mimeType: ref.mimeType, data: ref.base64 },
        })),
        { text: promptParts },
      ];

      const response = await ai.models.generateContent({
        model: MODEL,
        contents,
        config: { responseModalities: ["TEXT", "IMAGE"] },
      });

      const parts = response.candidates?.[0]?.content?.parts ?? [];
      const imagePart = parts.find((p) => p.inlineData);

      if (!imagePart?.inlineData) {
        throw new Error("Gemini did not return an image for this direction.");
      }

      return `data:${imagePart.inlineData.mimeType ?? "image/png"};base64,${imagePart.inlineData.data}`;
    });

    const images = await Promise.all(requests);
    return { images };
  }
}