import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { KeyRound, Download, ShieldCheck, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  type Algo,
  type KeyPairExport,
  exportKeyPair,
  generateKeyPair,
  downloadJSON,
} from "@/lib/crypto";

export const GeneratePanel = () => {
  const [algo, setAlgo] = useState<Algo>("ECDSA");
  const [busy, setBusy] = useState(false);
  const [pair, setPair] = useState<KeyPairExport | null>(null);

  const generate = async () => {
    setBusy(true);
    try {
      const kp = await generateKeyPair(algo);
      const exported = await exportKeyPair(algo, kp);
      setPair(exported);
      toast.success("Keypair generated", {
        description: "Download and store your private key securely.",
      });
    } catch (e) {
      toast.error("Key generation failed", { description: String(e) });
    } finally {
      setBusy(false);
    }
  };

  return (
    <Card className="border-border bg-card/60 p-6 shadow-elegant">
      <div className="mb-6 flex items-start gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <KeyRound className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-lg font-semibold">Generate Keypair</h2>
          <p className="text-sm text-muted-foreground">
            Create a fresh asymmetric keypair in your browser.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="algo">Algorithm</Label>
          <Select value={algo} onValueChange={(v) => setAlgo(v as Algo)}>
            <SelectTrigger id="algo">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ECDSA">ECDSA - P-256 (recommended)</SelectItem>
              <SelectItem value="RSA-PSS">RSA-PSS - 2048-bit</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button
          onClick={generate}
          disabled={busy}
          className="w-full bg-gradient-primary text-primary-foreground shadow-glow hover:opacity-90"
        >
          {busy ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <KeyRound className="mr-2 h-4 w-4" />
          )}
          Generate Keypair
        </Button>

        {pair && (
          <div className="space-y-3 rounded-lg border border-success/30 bg-success/5 p-4">
            <div className="flex items-center gap-2 text-sm font-medium text-success">
              <ShieldCheck className="h-4 w-4" />
              Keypair ready
            </div>
            <p className="text-xs text-muted-foreground">
              Download both files. Keep the <strong>private key</strong> safe - anyone with it can sign in your name.
              Share the <strong>public key</strong> with verifiers.
            </p>
            <div className="grid gap-2 sm:grid-cols-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  downloadJSON(`digisign-private-${algo}.json`, {
                    algorithm: pair.algorithm,
                    privateKey: pair.privateKey,
                    createdAt: pair.createdAt,
                  })
                }
              >
                <Download className="mr-2 h-4 w-4" />
                Private Key
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  downloadJSON(`digisign-public-${algo}.json`, {
                    algorithm: pair.algorithm,
                    publicKey: pair.publicKey,
                    createdAt: pair.createdAt,
                  })
                }
              >
                <Download className="mr-2 h-4 w-4" />
                Public Key
              </Button>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};