import { GoogleGenAI } from "@google/genai";
import type {
  AIProvider,
  GenerationInput,
  GenerationResult,
} from "@/lib/ai/types";

const MODEL = "gemini-3.1-flash-image";

const CREATIVE_DIRECTIONS = [
  "an editorial-style advertisement with sophisticated, magazine-quality composition",
  "a lifestyle advertisement showing the product naturally in use",
  "a clean product-first advertisement with the item as the clear hero",
  "a bold campaign-style advertisement with strong visual impact",
];

export class GeminiProvider implements AIProvider {
  async generate(
    input: GenerationInput,
    apiKey: string,
  ): Promise<GenerationResult> {
    const ai = new GoogleGenAI({ apiKey });

    const requests = CREATIVE_DIRECTIONS.map(async (direction) => {
      const prompt = [
        `Create ${direction} for this product: "${input.productName}".`,
        input.description ? `Context: ${input.description}.` : "",
        "Keep the product recognizable and true to the reference photo.",
        "Do not include any text, words, letters, or typography in the image — leave clean, uncluttered space for text to be added separately.",
      ]
        .filter(Boolean)
        .join(" ");

      const response = await ai.models.generateContent({
        model: MODEL,
        contents: [
          {
            inlineData: {
              mimeType: input.productImage.mimeType,
              data: input.productImage.base64,
            },
          },
          { text: prompt },
        ],
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
