const MAX_BYTES = 8 * 1024 * 1024;
const MAX_EDGE = 1200;
const MAX_DATA_URL = 1_500_000;

export interface PhotoResult {
  ok: boolean;
  dataUrl: string | null;
  message: string;
}

export function validatePhotoFile(file: File): string | null {
  const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  if (!allowed.includes(file.type)) {
    return "Use a JPEG, PNG, WEBP, or GIF, or save the item without a photo.";
  }
  if (file.size > MAX_BYTES) {
    return "That photo is over 8 MB. Try a smaller image, or save the item without a photo.";
  }
  return null;
}

export function readPhotoFile(
  file: File,
  onProgress: (percent: number) => void,
): Promise<PhotoResult> {
  const invalid = validatePhotoFile(file);
  if (invalid) return Promise.resolve({ ok: false, dataUrl: null, message: invalid });

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onprogress = (event) => {
      if (!event.lengthComputable) return;
      onProgress(Math.round((event.loaded / event.total) * 70));
    };
    reader.onerror = () => {
      resolve({
        ok: false,
        dataUrl: null,
        message: "The photo could not be read. You can try again, or save the item without a photo.",
      });
    };
    reader.onload = () => {
      const source = typeof reader.result === "string" ? reader.result : "";
      onProgress(80);
      compressDataUrl(source)
        .then((dataUrl) => {
          onProgress(100);
          if (dataUrl.length > MAX_DATA_URL) {
            resolve({
              ok: false,
              dataUrl: null,
              message:
                "This browser cannot store a photo that large. The item can still be saved without it.",
            });
            return;
          }
          resolve({ ok: true, dataUrl, message: "Photo ready. It stays in this browser." });
        })
        .catch(() => {
          resolve({
            ok: false,
            dataUrl: null,
            message: "The photo could not be prepared. You can try again, or save the item without a photo.",
          });
        });
    };
    reader.readAsDataURL(file);
  });
}

function compressDataUrl(dataUrl: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => {
      const scale = Math.min(1, MAX_EDGE / Math.max(image.width, image.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round(image.width * scale));
      canvas.height = Math.max(1, Math.round(image.height * scale));
      const context = canvas.getContext("2d");
      if (!context) {
        reject(new Error("canvas"));
        return;
      }
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL("image/jpeg", 0.82));
    };
    image.onerror = () => reject(new Error("image"));
    image.src = dataUrl;
  });
}
