"use client";

import * as React from "react";
import { RotateCcw, Sparkles } from "lucide-react";

import { AppShell } from "@/components/nomi/app-shell";
import { ProductDropzone } from "@/components/nomi/product-dropzone";
import {
  ReferenceImages,
  type ReferenceImage,
} from "@/components/nomi/reference-images";
import {
  ProductForm,
  type ProductFormValues,
} from "@/components/nomi/product-form";
import {
  AdvancedControls,
  DEFAULT_ADVANCED_CONTROLS,
  type AdvancedControlsValue,
} from "@/components/nomi/advanced-controls";
import {
  GenerationProgress,
  type GenerationStatus,
} from "@/components/nomi/generation-progress";
import { CreativeCard } from "@/components/nomi/creative-card";
import { ImageLightbox } from "@/components/nomi/image-lightbox";
import { ProviderKeyCard } from "@/components/nomi/provider-key-card";
import {
  ProviderConnectionProvider,
  useProviderConnection,
} from "@/lib/provider-context";
import { compositeTextOverlay } from "@/lib/composite-text";
import { Button } from "@/components/ui/button";

type FlowStage = "form" | "generating" | "results";

const PROCESSING_STEP_COUNT = 4;
const STEP_TICK_MS = 700; // purely a display pacer while a real request is in flight

const WEIGHT_MAP: Record<string, number> = {
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
};

function CreatePageInner() {
  const { isConnected, provider, apiKey } = useProviderConnection();
  const [stage, setStage] = React.useState<FlowStage>("form");
  const [product, setProduct] = React.useState<ProductFormValues>({
    name: "",
    description: "",
  });
  const [photoFile, setPhotoFile] = React.useState<File | null>(null);
  const [photoPreviewUrl, setPhotoPreviewUrl] = React.useState<string | null>(null);
  const [references, setReferences] = React.useState<ReferenceImage[]>([]);
  const [advanced, setAdvanced] = React.useState<AdvancedControlsValue>(
    DEFAULT_ADVANCED_CONTROLS
  );
  const [status, setStatus] = React.useState<GenerationStatus>("queued");
  const [stepIndex, setStepIndex] = React.useState(0);
  const [images, setImages] = React.useState<string[]>([]);
  const [previewSrc, setPreviewSrc] = React.useState<string | null>(null);
  const [errorMessage, setErrorMessage] = React.useState<string>();

  const handlePhotoSelect = (file: File) => {
    setPhotoFile(file);
    setPhotoPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return URL.createObjectURL(file);
    });
  };

  const canGenerate =
    Boolean(photoFile) && product.name.trim().length > 0 && isConnected;

  const runGeneration = React.useCallback(async () => {
    if (!photoFile || !provider || !apiKey) return;

    setStage("generating");
    setStatus("processing");
    setStepIndex(0);
    setErrorMessage(undefined);

    // Advances the displayed step on a timer while the real request is in
    // flight — the backend does one atomic call with no granular progress
    // events, so this paces the message rather than faking the work itself.
    const ticker = setInterval(() => {
      setStepIndex((i) => Math.min(i + 1, PROCESSING_STEP_COUNT - 1));
    }, STEP_TICK_MS);

    try {
      const formData = new FormData();
      formData.append("provider", provider);
      formData.append("apiKey", apiKey);
      formData.append("productName", product.name);
      formData.append("description", product.description);
      formData.append("productImage", photoFile);

      references.forEach((ref, i) => {
        formData.append(`referenceImage${i}`, ref.file);
        formData.append(`referenceType${i}`, ref.type);
      });

      formData.append("creativeDirection", advanced.creative.direction);
      formData.append("format", advanced.creative.format);
      formData.append("headline", advanced.text.headline);
      formData.append("subheadline", advanced.text.subheadline);
      formData.append("cta", advanced.text.cta);
      formData.append("fontFamily", advanced.typography.family);
      formData.append("fontWeight", advanced.typography.weight);
      formData.append("colorPalette", JSON.stringify(advanced.palette));

      const res = await fetch("/api/generate", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? "Generation failed.");
      }

      // Composite the user's own typed text on top of every result —
      // reliable and crisp, instead of hoping the model rendered it.
      const weight = WEIGHT_MAP[advanced.typography.weight] ?? 600;
      const withText = await Promise.all(
        (data.images as string[]).map((src) =>
          compositeTextOverlay({
            imageSrc: src,
            headline: advanced.text.headline || undefined,
            subheadline: advanced.text.subheadline || undefined,
            cta: advanced.text.cta || undefined,
            fontWeight: weight,
          })
        )
      );

      setImages(withText);
      setStatus("done");
      setStage("results");
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : "Something went wrong."
      );
      setStatus("failed");
    } finally {
      clearInterval(ticker);
    }
  }, [photoFile, provider, apiKey, product, references, advanced]);

  const startOver = () => {
    setStage("form");
    setProduct({ name: "", description: "" });
    setPhotoFile(null);
    setPhotoPreviewUrl(null);
    setReferences([]);
    setAdvanced(DEFAULT_ADVANCED_CONTROLS);
    setImages([]);
    setErrorMessage(undefined);
  };

  return (
    <AppShell>
      <div className="mx-auto w-full max-w-2xl flex-1 px-6 py-16 md:px-8">
        {stage === "form" && (
          <div className="flex flex-col gap-8">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                Create an ad
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                One photo, a little context, four directions.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
              <ProductDropzone onFileSelect={handlePhotoSelect} />
              <ProductForm values={product} onChange={setProduct} />
            </div>

            <ReferenceImages value={references} onChange={setReferences} />

            <AdvancedControls
              value={advanced}
              onChange={setAdvanced}
              sourceImageUrl={photoPreviewUrl}
            />

            <ProviderKeyCard />

            <Button
              size="lg"
              className="h-11 w-fit gap-1.5 self-start px-6 text-[0.95rem]"
              disabled={!canGenerate}
              onClick={runGeneration}
            >
              <Sparkles className="size-4" aria-hidden="true" />
              Generate
            </Button>
          </div>
        )}

        {stage === "generating" && (
          <>
            <GenerationProgress
              status={status}
              stepIndex={stepIndex}
              errorMessage={errorMessage}
            />
            {status === "failed" && (
              <div className="mt-2 flex justify-center gap-2">
                <Button variant="outline" size="sm" onClick={runGeneration}>
                  <RotateCcw className="size-3.5" aria-hidden="true" />
                  Try again
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setStage("form")}
                >
                  Back to edit
                </Button>
              </div>
            )}
          </>
        )}

        {stage === "results" && (
          <div className="flex flex-col gap-8">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                  {product.name || "Your ad"}
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  Four directions, ready to compare.
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="shrink-0 gap-1.5"
                onClick={runGeneration}
              >
                <RotateCcw className="size-3.5" aria-hidden="true" />
                Regenerate
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
              {images.map((src, i) => (
                <CreativeCard
                  key={i}
                  src={src}
                  alt={`Generated advertisement direction ${i + 1}`}
                  showDownload
                  onDownload={() => {
                    const a = document.createElement("a");
                    a.href = src;
                    a.download = `${product.name || "nomi-ad"}-${i + 1}.png`;
                    a.click();
                  }}
                  onImageClick={() => setPreviewSrc(src)}
                  delay={i * 0.06}
                />
              ))}
            </div>

            <ImageLightbox
              src={previewSrc}
              alt="Generated advertisement, full size"
              onClose={() => setPreviewSrc(null)}
            />

            <Button variant="ghost" size="sm" className="w-fit" onClick={startOver}>
              Create another
            </Button>
          </div>
        )}
      </div>
    </AppShell>
  );
}

export default function CreatePage() {
  return (
    <ProviderConnectionProvider>
      <CreatePageInner />
    </ProviderConnectionProvider>
  );
}