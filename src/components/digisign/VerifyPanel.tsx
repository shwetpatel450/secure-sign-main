import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ShieldCheck, ShieldAlert, Loader2, BadgeCheck } from "lucide-react";
import { toast } from "sonner";
import { FileDrop } from "./FileDrop";
import {
  type SignatureEnvelope,
  importPublicKey,
  readFileAsArrayBuffer,
  readFileAsText,
  sha256Hex,
  verifyBuffer,
} from "@/lib/crypto";
import { cn } from "@/lib/utils";

interface Result {
  ok: boolean;
  message: string;
  detail?: string;
  envelope?: SignatureEnvelope;
  computedHash?: string;
}

export const VerifyPanel = () => {
  const [doc, setDoc] = useState<File | null>(null);
  const [sigFile, setSigFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<Result | null>(null);

  const verify = async () => {
    if (!doc || !sigFile) {
      toast.error("Select both the document and its signature file");
      return;
    }
    setBusy(true);
    setResult(null);
    try {
      const env = JSON.parse(await readFileAsText(sigFile)) as SignatureEnvelope;
      if (!env.signature || !env.publicKey || !env.algorithm) {
        throw new Error("Invalid signature envelope.");
      }
      const data = await readFileAsArrayBuffer(doc);
      const computedHash = await sha256Hex(data);

      if (computedHash !== env.fileHash) {
        setResult({
          ok: false,
          message: "Document has been altered",
          detail: "The file's hash does not match the signed hash.",
          envelope: env,
          computedHash,
        });
        return;
      }

      const pub = await importPublicKey(env.algorithm, env.publicKey);
      const valid = await verifyBuffer(env.algorithm, pub, env.signature, data);

      setResult(
        valid
          ? {
              ok: true,
              message: "Signature is valid",
              detail: "The document is authentic and unaltered.",
              envelope: env,
              computedHash,
            }
          : {
              ok: false,
              message: "Signature verification failed",
              detail: "The signature does not match this public key.",
              envelope: env,
              computedHash,
            },
      );
    } catch (e) {
      setResult({
        ok: false,
        message: "Verification error",
        detail: String(e),
      });
    } finally {
      setBusy(false);
    }
  };

  return (
    <Card className="border-border bg-card/60 p-6 shadow-elegant">
      <div className="mb-6 flex items-start gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <BadgeCheck className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-lg font-semibold">Verify a Signature</h2>
          <p className="text-sm text-muted-foreground">
            Confirm a document is authentic and untampered.
          </p>
        </div>
      </div>

      <div className="space-y-5">
        <div className="space-y-2">
          <Label>Original document</Label>
          <FileDrop file={doc} onFile={setDoc} label="Drop document to verify" />
        </div>

        <div className="space-y-2">
          <Label>Signature envelope (.digisig.json)</Label>
          <FileDrop
            file={sigFile}
            onFile={setSigFile}
            label="Drop signature .json"
            accept="application/json,.json"
          />
        </div>

        <Button
          onClick={verify}
          disabled={busy || !doc || !sigFile}
          className="w-full bg-gradient-primary text-primary-foreground shadow-glow hover:opacity-90"
        >
          {busy ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <BadgeCheck className="mr-2 h-4 w-4" />
          )}
          Verify
        </Button>

        {result && (
          <div
            className={cn(
              "space-y-3 rounded-lg border p-4",
              result.ok
                ? "border-success/40 bg-success/5"
                : "border-destructive/40 bg-destructive/5",
            )}
          >
            <div
              className={cn(
                "flex items-center gap-2 text-sm font-semibold",
                result.ok ? "text-success" : "text-destructive",
              )}
            >
              {result.ok ? (
                <ShieldCheck className="h-5 w-5" />
              ) : (
                <ShieldAlert className="h-5 w-5" />
              )}
              {result.message}
            </div>
            {result.detail && (
              <p className="text-xs text-muted-foreground">{result.detail}</p>
            )}
            {result.envelope && (
              <dl className="grid grid-cols-1 gap-2 text-xs sm:grid-cols-2">
                <div>
                  <dt className="text-muted-foreground">Algorithm</dt>
                  <dd className="font-mono">{result.envelope.algorithm}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Signed at</dt>
                  <dd className="font-mono">
                    {new Date(result.envelope.signedAt).toLocaleString()}
                  </dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-muted-foreground">Signed file hash (SHA-256)</dt>
                  <dd className="break-all font-mono text-[10px]">
                    {result.envelope.fileHash}
                  </dd>
                </div>
                {result.computedHash && (
                  <div className="sm:col-span-2">
                    <dt className="text-muted-foreground">Your file hash (SHA-256)</dt>
                    <dd className="break-all font-mono text-[10px]">
                      {result.computedHash}
                    </dd>
                  </div>
                )}
              </dl>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};
