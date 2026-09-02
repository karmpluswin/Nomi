/**
 * Extracts a small set of dominant colors from an image using canvas pixel
 * sampling + coarse color quantization. Runs entirely client-side.
 */
export async function extractPalette(
  imageUrl: string,
  count = 5
): Promise<string[]> {
  const img = await loadImage(imageUrl);

  const canvas = document.createElement("canvas");
  const size = 64; // downscale — we only need color distribution, not detail
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) return [];

  ctx.drawImage(img, 0, 0, size, size);
  const { data } = ctx.getImageData(0, 0, size, size);

  const buckets = new Map<string, { r: number; g: number; b: number; n: number }>();
  const step = 32; // quantization bucket width per channel

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const a = data[i + 3];
    if (a < 200) continue; // skip transparent pixels

    const key = [
      Math.round(r / step) * step,
      Math.round(g / step) * step,
      Math.round(b / step) * step,
    ].join(",");

    const bucket = buckets.get(key) ?? { r: 0, g: 0, b: 0, n: 0 };
    bucket.r += r;
    bucket.g += g;
    bucket.b += b;
    bucket.n += 1;
    buckets.set(key, bucket);
  }

  const sorted = [...buckets.values()].sort((a, b) => b.n - a.n);

  return sorted.slice(0, count).map((bucket) => {
    const r = Math.round(bucket.r / bucket.n);
    const g = Math.round(bucket.g / bucket.n);
    const b = Math.round(bucket.b / bucket.n);
    return rgbToHex(r, g, b);
  });
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function rgbToHex(r: number, g: number, b: number): string {
  return (
    "#" +
    [r, g, b].map((c) => c.toString(16).padStart(2, "0")).join("")
  );
}