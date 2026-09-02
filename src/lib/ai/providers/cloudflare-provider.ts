import type {
  AIProvider,
  GenerationInput,
  GenerationResult,
} from "@/lib/ai/types";

const MODEL = "@cf/black-forest-labs/flux-1-schnell";

const DIRECTION_PHRASES: Record<string, string> = {
  auto: "a polished advertisement photo",
  minimal: "a minimal, restrained advertisement photo",
  editorial: "a sophisticated, magazine-editorial advertisement photo",
  luxury: "a premium, luxury advertisement photo",
  bold: "a bold, high-impact advertisement photo",
};

const FALLBACK_VARIANTS = [
  "an editorial-style advertisement photo",
  "a lifestyle advertisement photo",
  "a clean product-first advertisement photo",
  "a bold campaign-style advertisement photo",
];

function parseCloudflareCredentials(rawKey: string) {
  const cleaned = rawKey
    .trim()
    .replace(/^Bearer\s+/i, "")
    .trim();
  const separatorIndex = cleaned.lastIndexOf(":");
  const accountId =
    separatorIndex > 0 ? cleaned.slice(0, separatorIndex).trim() : "";
  const apiToken =
    separatorIndex >= 0 ? cleaned.slice(separatorIndex + 1).trim() : "";

  if (!accountId || !apiToken) {
    throw new Error(
      'Cloudflare needs both an Account ID and API Token, in the form "accountId:apiToken".',
    );
  }

  return { accountId, apiToken };
}

export class CloudflareProvider implements AIProvider {
  async generate(
    input: GenerationInput,
    apiKey: string,
  ): Promise<GenerationResult> {
    const { accountId, apiToken } = parseCloudflareCredentials(apiKey);

    const directionPhrase =
      input.creativeDirection && input.creativeDirection !== "auto"
        ? DIRECTION_PHRASES[input.creativeDirection]
        : null;

    const variants = directionPhrase
      ? [directionPhrase, directionPhrase, directionPhrase, directionPhrase]
      : FALLBACK_VARIANTS;

    const requests = variants.map(async (variantPhrase) => {
      // Text-to-image only — this model cannot see the uploaded photo.
      // The prompt leans on the product name/description instead.
      const prompt = [
        `${variantPhrase} for a product called "${input.productName}".`,
        input.description ? `${input.description}.` : "",
        "Professional product photography, studio quality.",
        "Do not include any text, words, letters, or typography in the image — clean visual composition only.",
      ]
        .filter(Boolean)
        .join(" ");

      const res = await fetch(
        `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/${MODEL}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ prompt }),
        },
      );

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        const apiMessage =
          body?.errors?.[0]?.message ??
          `Cloudflare request failed (${res.status}).`;

        if (
          res.status === 401 ||
          res.status === 403 ||
          /authentication error/i.test(apiMessage)
        ) {
          throw new Error(
            'Cloudflare authentication failed. Check that your Account ID and API Token are correct and formatted as "accountId:apiToken".',
          );
        }

        throw new Error(apiMessage);
      }

      const data = await res.json();
      if (!data.success || !data.result?.image) {
        throw new Error(
          "Cloudflare did not return an image for this direction.",
        );
      }

      return `data:image/png;base64,${data.result.image}`;
    });

    const images = await Promise.all(requests);
    return { images };
  }
}
