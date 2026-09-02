export interface TextOverlayInput {
  imageSrc: string;
  headline?: string;
  subheadline?: string;
  cta?: string;
  fontWeight?: number;
}

export async function compositeTextOverlay({
  imageSrc,
  headline,
  subheadline,
  cta,
  fontWeight = 600,
}: TextOverlayInput): Promise<string> {
  if (!headline && !subheadline && !cta) return imageSrc;

  const img = await loadImage(imageSrc);
  const canvas = document.createElement("canvas");
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  const ctx = canvas.getContext("2d");
  if (!ctx) return imageSrc;

  ctx.drawImage(img, 0, 0);

  const w = canvas.width;
  const h = canvas.height;
  const pad = w * 0.06;

  if (headline || subheadline) {
    const gradient = ctx.createLinearGradient(0, 0, 0, h * 0.32);
    gradient.addColorStop(0, "rgba(0,0,0,0.55)");
    gradient.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, w, h * 0.32);
  }

  ctx.textBaseline = "top";
  ctx.fillStyle = "#ffffff";

  let cursorY = pad;
  if (headline) {
    const size = Math.round(w * 0.065);
    ctx.font = `${fontWeight} ${size}px Geist, sans-serif`;
    cursorY = wrapText(ctx, headline, pad, cursorY, w - pad * 2, size * 1.15);
  }
  if (subheadline) {
    const size = Math.round(w * 0.032);
    ctx.font = `500 ${size}px Geist, sans-serif`;
    ctx.globalAlpha = 0.9;
    cursorY = wrapText(ctx, subheadline, pad, cursorY + size * 0.3, w - pad * 2, size * 1.3);
    ctx.globalAlpha = 1;
  }

  if (cta) {
    const size = Math.round(w * 0.032);
    ctx.font = `600 ${size}px Geist, sans-serif`;
    const metrics = ctx.measureText(cta);
    const btnPadX = size * 0.9;
    const btnPadY = size * 0.55;
    const btnW = metrics.width + btnPadX * 2;
    const btnH = size + btnPadY * 2;
    const btnX = pad;
    const btnY = h - pad - btnH;

    ctx.fillStyle = "#ffffff";
    roundRect(ctx, btnX, btnY, btnW, btnH, btnH / 2);
    ctx.fill();

    ctx.fillStyle = "#111111";
    ctx.fillText(cta, btnX + btnPadX, btnY + btnPadY);
  }

  return canvas.toDataURL("image/png");
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number
): number {
  const words = text.split(" ");
  let line = "";
  let cursorY = y;
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && line) {
      ctx.fillText(line, x, cursorY);
      line = word;
      cursorY += lineHeight;
    } else {
      line = test;
    }
  }
  if (line) {
    ctx.fillText(line, x, cursorY);
    cursorY += lineHeight;
  }
  return cursorY;
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
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