import { fal } from "@fal-ai/client";
import type {
  AIProvider,
  GenerationInput,
  GenerationResult,
} from "@/lib/ai/types";

const MODEL = "fal-ai/flux-pro/kontext";

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

export class FalProvider implements AIProvider {
  async generate(
    input: GenerationInput,
    apiKey: string,
  ): Promise<GenerationResult> {
    fal.config({ credentials: apiKey });

    // fal needs a hosted URL for the reference image, not raw base64 —
    // upload it once, reuse the same URL for all 4 direction calls.
    const imageFile = new File(
      [Buffer.from(input.productImage.base64, "base64")],
      "product.jpg",
      { type: input.productImage.mimeType },
    );
    const imageUrl = await fal.storage.upload(imageFile);

    const directionPhrase =
      input.creativeDirection && input.creativeDirection !== "auto"
        ? DIRECTION_PHRASES[input.creativeDirection]
        : null;

    const variants = directionPhrase
      ? [directionPhrase, directionPhrase, directionPhrase, directionPhrase]
      : FALLBACK_VARIANTS;

    const requests = variants.map(async (variantPhrase) => {
      const prompt = [
        `Turn this product photo into ${variantPhrase} for "${input.productName}".`,
        input.description ? `Context: ${input.description}.` : "",
        "Keep the product recognizable and true to the reference photo.",
        "Do not include any text, words, letters, or typography in the image — leave clean, uncluttered space for text to be added separately.",
      ]
        .filter(Boolean)
        .join(" ");

      const result = await fal.subscribe(MODEL, {
        input: {
          prompt,
          image_url: imageUrl,
        },
      });

      const outputUrl = result.data?.images?.[0]?.url;
      if (!outputUrl) {
        throw new Error("fal did not return an image for this direction.");
      }

      return outputUrl;
    });

    const images = await Promise.all(requests);
    return { images };
  }
}
