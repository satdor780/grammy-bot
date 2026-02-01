import { createHmac } from 'node:crypto';
export function hmacSha256(
  key: string | Uint8Array | Buffer,
  msg: string | Uint8Array | Buffer
): Buffer {
  const hmac = createHmac('sha256', key);
  hmac.update(msg);
  return hmac.digest();
}

export function hmacSha256Hex(
  key: string | Uint8Array | Buffer,
  msg: string | Uint8Array | Buffer
): string {
  const hmac = createHmac('sha256', key);
  hmac.update(msg);
  return hmac.digest('hex');
}

//