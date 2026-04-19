import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { FileSignature, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { FileDrop } from "./FileDrop";
import {
  type Algo,
  type SignatureEnvelope,
  downloadJSON,
  importPrivateKey,
  readFileAsArrayBuffer,
  readFileAsText,
  sha256Hex,
  signBuffer,
} from "@/lib/crypto";

export const SignPanel = () => {
  const [doc, setDoc] = useState<File | null>(null);
  const [keyFile, setKeyFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);

  const sign = async () => {
    if (!doc || !keyFile) {
      toast.error("Select both a document and your private key");
      return;
    }
    setBusy(true);
    try {
      const keyJson = JSON.parse(await readFileAsText(keyFile));
      const algo: Algo = keyJson.algorithm;
      if (algo !== "RSA-PSS" && algo !== "ECDSA") {
        throw new Error("Unsupported or missing algorithm in key file.");
      }
      if (!keyJson.privateKey) throw new Error("Private key field missing.");

      const privateKey = await importPrivateKey(algo, keyJson.privateKey);
      const data = await readFileAsArrayBuffer(doc);
      const fileHash = await sha256Hex(data);
      const signature = await signBuffer(algo, privateKey, data);

      // Derive public JWK from private JWK (strip 'd' for RSA, 'd' for EC).
      const pub: Record<string, unknown> = { ...keyJson.privateKey };
      delete pub.d;
      delete (pub as Record<string, unknown>).p;
      delete (pub as Record<string, unknown>).q;
      delete (pub as Record<string, unknown>).dp;
      delete (pub as Record<string, unknown>).dq;
      delete (pub as Record<string, unknown>).qi;
      pub.key_ops = ["verify"];

      const envelope: SignatureEnvelope = {
        version: 1,
        algorithm: algo,
        hash: "SHA-256",
        fileName: doc.name,
        fileSize: doc.size,
        fileHash,
        signature,
        publicKey: pub as JsonWebKey,
        signedAt: new Date().toISOString(),
      };

      downloadJSON(`${doc.name}.digisig.json`, envelope);
      toast.success("Document signed", {
        description: "Signature envelope downloaded.",
      });
    } catch (e) {
      toast.error("Signing failed", { description: String(e) });
    } finally {
      setBusy(false);
    }
  };

  return (
    <Card className="border-border bg-card/60 p-6 shadow-elegant">
      <div className="mb-6 flex items-start gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <FileSignature className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-lg font-semibold">Sign a Document</h2>
          <p className="text-sm text-muted-foreground">
            Generate a tamper-evident signature using your private key.
          </p>
        </div>
      </div>

      <div className="space-y-5">
        <div className="space-y-2">
          <Label>Document to sign</Label>
          <FileDrop file={doc} onFile={setDoc} label="Drop document here" />
        </div>

        <div className="space-y-2">
          <Label>Private key file (.json)</Label>
          <FileDrop
            file={keyFile}
            onFile={setKeyFile}
            label="Drop private key (.json)"
            accept="application/json,.json"
          />
        </div>

        <Button
          onClick={sign}
          disabled={busy || !doc || !keyFile}
          className="w-full bg-gradient-primary text-primary-foreground shadow-glow hover:opacity-90"
        >
          {busy ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <FileSignature className="mr-2 h-4 w-4" />
          )}
          Sign &amp; Download Signature
        </Button>
      </div>
    </Card>
  );
};
