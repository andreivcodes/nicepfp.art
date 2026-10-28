// Validation for the drawing the client sends to the getIpfs server action.
// The canvas is captured with HTMLCanvasElement.toDataURL(), which produces a
// PNG data URL, so that is the only format accepted.

// Next.js already caps server action bodies at 1 MB by default; this is the
// app-level limit on the decoded image in case that limit is ever raised.
// Real drawings are far smaller (line art on a white background).
export const MAX_IMAGE_BYTES = 1024 * 1024;

const DATA_URL_PREFIX = "data:image/png;base64,";
const BASE64_RE = /^[A-Za-z0-9+/]+={0,2}$/;
const PNG_SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
// 8-byte signature + IHDR chunk (4 length + 4 type + 13 data + 4 CRC)
const MIN_PNG_BYTES = 8 + 25;

export type ParsedImage = { ok: true; buffer: Buffer<ArrayBuffer> } | { ok: false; error: string };

export function parsePngDataUrl(input: unknown): ParsedImage {
  const invalid: ParsedImage = { ok: false, error: "Invalid image. Please redraw and try again." };

  if (typeof input !== "string" || !input.startsWith(DATA_URL_PREFIX)) return invalid;

  const base64 = input.slice(DATA_URL_PREFIX.length);
  // Reject oversized input before decoding it.
  if (base64.length > Math.ceil(MAX_IMAGE_BYTES / 3) * 4) {
    return { ok: false, error: "Image is too large." };
  }
  if (base64.length % 4 !== 0 || !BASE64_RE.test(base64)) return invalid;

  const buffer = Buffer.from(base64, "base64");
  if (buffer.length > MAX_IMAGE_BYTES) return { ok: false, error: "Image is too large." };
  if (buffer.length < MIN_PNG_BYTES || !buffer.subarray(0, 8).equals(PNG_SIGNATURE)) return invalid;
  if (buffer.toString("latin1", 12, 16) !== "IHDR") return invalid;

  return { ok: true, buffer };
}
