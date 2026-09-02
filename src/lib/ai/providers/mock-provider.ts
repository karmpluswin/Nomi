import type { AIProvider, GenerationInput, GenerationResult } from "@/lib/ai/types";

const MOCK_IMAGES = [
  "https://picsum.photos/seed/nomi-mock-1/700/875",
  "https://picsum.photos/seed/nomi-mock-2/700/875",
  "https://picsum.photos/seed/nomi-mock-3/700/875",
  "https://picsum.photos/seed/nomi-mock-4/700/875",
];

export class MockAIProvider implements AIProvider {
  async generate(_input: GenerationInput): Promise<GenerationResult> {
    await new Promise((resolve) => setTimeout(resolve, 800));
    return { images: MOCK_IMAGES };
  }
}