// Web Crypto helpers for the DigiSign tool.
// Supports RSA-PSS (2048) and ECDSA (P-256). All keys handled in-browser.

export type Algo = "RSA-PSS" | "ECDSA";

export interface KeyPairExport {
  algorithm: Algo;
  publicKey: JsonWebKey;
  privateKey: JsonWebKey;
  createdAt: string;
}

export interface SignatureEnvelope {
  version: 1;
  algorithm: Algo;
  hash: "SHA-256";
  fileName: string;
  fileSize: number;
  fileHash: string; // hex SHA-256
  signature: string; // base64
  publicKey: JsonWebKey;
  signedAt: string;
}

const enc = new TextEncoder();

export const algoParams = (algo: Algo) =>
  algo === "RSA-PSS"
    ? { name: "RSA-PSS", saltLength: 32 }
    : { name: "ECDSA", hash: "SHA-256" };

export async function generateKeyPair(algo: Algo): Promise<CryptoKeyPair> {
  if (algo === "RSA-PSS") {
    return crypto.subtle.generateKey(
      {
        name: "RSA-PSS",
        modulusLength: 2048,
        publicExponent: new Uint8Array([1, 0, 1]),
        hash: "SHA-256",
      },
      true,
      ["sign", "verify"],
    );
  }
  return crypto.subtle.generateKey(
    { name: "ECDSA", namedCurve: "P-256" },
    true,
    ["sign", "verify"],
  );
}

export async function exportKeyPair(
  algo: Algo,
  pair: CryptoKeyPair,
): Promise<KeyPairExport> {
  const [publicKey, privateKey] = await Promise.all([
    crypto.subtle.exportKey("jwk", pair.publicKey),
    crypto.subtle.exportKey("jwk", pair.privateKey),
  ]);
  return {
    algorithm: algo,
    publicKey,
    privateKey,
    createdAt: new Date().toISOString(),
  };
}

export async function importPrivateKey(
  algo: Algo,
  jwk: JsonWebKey,
): Promise<CryptoKey> {
  const params =
    algo === "RSA-PSS"
      ? { name: "RSA-PSS", hash: "SHA-256" }
      : { name: "ECDSA", namedCurve: "P-256" };
  return crypto.subtle.importKey("jwk", jwk, params, false, ["sign"]);
}

export async function importPublicKey(
  algo: Algo,
  jwk: JsonWebKey,
): Promise<CryptoKey> {
  const params =
    algo === "RSA-PSS"
      ? { name: "RSA-PSS", hash: "SHA-256" }
      : { name: "ECDSA", namedCurve: "P-256" };
  return crypto.subtle.importKey("jwk", jwk, params, true, ["verify"]);
}

export async function sha256Hex(buffer: ArrayBuffer): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", buffer);
  return [...new Uint8Array(digest)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function signBuffer(
  algo: Algo,
  privateKey: CryptoKey,
  data: ArrayBuffer,
): Promise<string> {
  const sig = await crypto.subtle.sign(algoParams(algo), privateKey, data);
  return bufToBase64(sig);
}

export async function verifyBuffer(
  algo: Algo,
  publicKey: CryptoKey,
  signatureB64: string,
  data: ArrayBuffer,
): Promise<boolean> {
  return crypto.subtle.verify(
    algoParams(algo),
    publicKey,
    base64ToBuf(signatureB64),
    data,
  );
}

export function bufToBase64(buf: ArrayBuffer): string {
  const bytes = new Uint8Array(buf);
  let bin = "";
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin);
}

export function base64ToBuf(b64: string): ArrayBuffer {
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes.buffer;
}

export function downloadJSON(filename: string, data: unknown) {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  triggerDownload(filename, blob);
}

export function triggerDownload(filename: string, blob: Blob) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function readFileAsArrayBuffer(file: File): Promise<ArrayBuffer> {
  return file.arrayBuffer();
}

export function readFileAsText(file: File): Promise<string> {
  return file.text();
}

// Touch encoder so tree-shakers don't drop it; used for future text inputs.
void enc;
