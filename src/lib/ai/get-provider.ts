import type { AIProvider } from "@/lib/ai/types";
import { MockAIProvider } from "@/lib/ai/providers/mock-provider";
import { GeminiProvider } from "@/lib/ai/providers/gemini-provider";
import { FalProvider } from "@/lib/ai/providers/fal-provider";
import { OpenRouterProvider } from "@/lib/ai/providers/openrouter-provider";
import { CloudflareProvider } from "@/lib/ai/providers/cloudflare-provider";

export type SupportedProvider =
  | "mock"
  | "gemini"
  | "fal"
  | "openrouter"
  | "cloudflare";

export function getProvider(id: string): AIProvider {
  switch (id as SupportedProvider) {
    case "mock":
      return new MockAIProvider();
    case "gemini":
      return new GeminiProvider();
    case "fal":
      return new FalProvider();
    case "openrouter":
      return new OpenRouterProvider();
    case "cloudflare":
      return new CloudflareProvider();
    default:
      throw new Error(`Provider "${id}" isn't implemented yet.`);
  }
}