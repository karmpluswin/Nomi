import type {
  AIProvider,
  GenerationInput,
  GenerationResult,
} from "@/lib/ai/types";

const ENDPOINT = "https://openrouter.ai/api/v1/images";
const MODEL = "google/gemini-2.5-flash-image";

const DIRECTION_PHRASES: Record<string, string> = {
  auto: "a polished advertisement",
  minimal: "a minimal, restrained advertisement",
  editorial: "a sophisticated, magazine-editorial advertisement",
  luxury: "a premium, luxury advertisement",
  bold: "a bold, high-impact advertisement",
};

const FALLBACK_VARIANTS = [
  "an editorial-style advertisement",
  "a lifestyle advertisement",
  "a clean product-first advertisement",
  "a bold campaign-style advertisement",
];

export class OpenRouterProvider implements AIProvider {
  async generate(
    input: GenerationInput,
    apiKey: string,
  ): Promise<GenerationResult> {
    const directionPhrase =
      input.creativeDirection && input.creativeDirection !== "auto"
        ? DIRECTION_PHRASES[input.creativeDirection]
        : null;

    const variants = directionPhrase
      ? [directionPhrase, directionPhrase, directionPhrase, directionPhrase]
      : FALLBACK_VARIANTS;

    const referenceDataUrl = `data:${input.productImage.mimeType};base64,${input.productImage.base64}`;

    const requests = variants.map(async (variantPhrase) => {
      const prompt = [
        `Turn this product photo into ${variantPhrase} for "${input.productName}".`,
        input.description ? `Context: ${input.description}.` : "",
        "Keep the product recognizable and true to the reference photo.",
        "Do not include any text, words, letters, or typography in the image — leave clean, uncluttered space for text to be added separately.",
      ]
        .filter(Boolean)
        .join(" ");

      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: MODEL,
          prompt,
          input_references: [
            {
              type: "image_url",
              image_url: { url: referenceDataUrl },
            },
          ],
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(
          body?.error?.message ?? `OpenRouter request failed (${res.status}).`,
        );
      }

      const data = await res.json();
      const image = data.data?.[0];
      if (!image?.b64_json) {
        throw new Error(
          "OpenRouter did not return an image for this direction.",
        );
      }

      return `data:${image.media_type ?? "image/png"};base64,${image.b64_json}`;
    });

    const images = await Promise.all(requests);
    return { images };
  }
}
