// 카메라 캡쳐 파일 → 리사이즈된 JPEG data URL (클라이언트 전용).
// 원본 수 MB 사진을 그대로 올리지 않도록 긴 변 기준으로 줄여서 인코딩한다.

const MAX_DIM = 1280;
const QUALITY = 0.82;

async function loadBitmap(file: File): Promise<ImageBitmap | HTMLImageElement> {
  // createImageBitmap: EXIF 회전 반영. 미지원 브라우저는 <img> 폴백.
  try {
    return await createImageBitmap(file, { imageOrientation: "from-image" });
  } catch {
    return new Promise((resolve, reject) => {
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => {
        URL.revokeObjectURL(url);
        resolve(img);
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error("image load failed"));
      };
      img.src = url;
    });
  }
}

export async function fileToJpegDataUrl(file: File): Promise<string> {
  const src = await loadBitmap(file);
  const w = "width" in src ? src.width : 0;
  const h = "height" in src ? src.height : 0;
  const scale = Math.min(1, MAX_DIM / Math.max(w, h));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(w * scale);
  canvas.height = Math.round(h * scale);
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("canvas unavailable");
  ctx.drawImage(src, 0, 0, canvas.width, canvas.height);
  if ("close" in src) src.close();
  return canvas.toDataURL("image/jpeg", QUALITY);
}
