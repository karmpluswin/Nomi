export interface GenerationInput {
  productImage: {
    base64: string;
    mimeType: string;
  };
  references?: {
    base64: string;
    mimeType: string;
    type: string;
  }[];
  productName: string;
  description?: string;
  creativeDirection?: string;
  format?: string;
  headline?: string;
  subheadline?: string;
  cta?: string;
  font?: {
    family: string;
    weight: string;
  };
  colorPalette?: {
    mode: "auto" | "custom";
    colors: string[];
  };
}

export interface GenerationResult {
  images: string[]; // data URLs, e.g. "data:image/png;base64,..."
}

export interface AIProvider {
  generate(input: GenerationInput, apiKey: string): Promise<GenerationResult>;
}