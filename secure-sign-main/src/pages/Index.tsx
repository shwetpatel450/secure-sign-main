import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShieldCheck, KeyRound, FileSignature, BadgeCheck, Lock } from "lucide-react";
import { GeneratePanel } from "@/components/digisign/GeneratePanel";
import { SignPanel } from "@/components/digisign/SignPanel";
import { VerifyPanel } from "@/components/digisign/VerifyPanel";

const Index = () => {
  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[600px] bg-gradient-glow" />

      <header className="relative border-b border-border/60 backdrop-blur">
        <div className="container flex items-center justify-between py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-primary text-primary-foreground shadow-glow">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-base font-semibold tracking-tight">DigiSign</h1>
              <p className="text-xs text-muted-foreground">
                Web-based digital signing and verification
              </p>
            </div>
          </div>
          <div className="hidden items-center gap-2 rounded-full border border-border bg-secondary/40 px-3 py-1.5 text-xs text-muted-foreground sm:flex">
            <Lock className="h-3.5 w-3.5 text-primary" />
            100% client-side - keys never uploaded
          </div>
        </div>
      </header>

      <main className="container relative py-12">
        <section className="mx-auto mb-12 max-w-2xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
            <BadgeCheck className="h-3.5 w-3.5" />
            RSA-PSS and ECDSA - SHA-256
          </div>
          <h2 className="bg-gradient-primary bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-5xl">
            Sign and verify any document
          </h2>
          <p className="mt-4 text-base text-muted-foreground">
            Generate a unique cryptographic fingerprint, sign it with your private key,
            and prove that your file has not been altered - all in your browser.
          </p>
        </section>

        <div className="mx-auto max-w-2xl">
          <Tabs defaultValue="generate" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-secondary/40">
              <TabsTrigger value="generate" className="gap-2 data-[state=active]:bg-card">
                <KeyRound className="h-4 w-4" />
                <span className="hidden sm:inline">Generate</span>
              </TabsTrigger>
              <TabsTrigger value="sign" className="gap-2 data-[state=active]:bg-card">
                <FileSignature className="h-4 w-4" />
                <span className="hidden sm:inline">Sign</span>
              </TabsTrigger>
              <TabsTrigger value="verify" className="gap-2 data-[state=active]:bg-card">
                <BadgeCheck className="h-4 w-4" />
                <span className="hidden sm:inline">Verify</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="generate" className="mt-6">
              <GeneratePanel />
            </TabsContent>
            <TabsContent value="sign" className="mt-6">
              <SignPanel />
            </TabsContent>
            <TabsContent value="verify" className="mt-6">
              <VerifyPanel />
            </TabsContent>
          </Tabs>

          <div className="mt-8 grid gap-3 text-xs text-muted-foreground sm:grid-cols-3">
            <div className="rounded-lg border border-border bg-card/40 p-3">
              <p className="font-medium text-foreground">1 - Generate</p>
              <p>Create an RSA or ECDSA keypair locally.</p>
            </div>
            <div className="rounded-lg border border-border bg-card/40 p-3">
              <p className="font-medium text-foreground">2 - Sign</p>
              <p>Use your private key to sign a document.</p>
            </div>
            <div className="rounded-lg border border-border bg-card/40 p-3">
              <p className="font-medium text-foreground">3 - Verify</p>
              <p>Anyone can verify with the public key.</p>
            </div>
          </div>
        </div>
      </main>

      <footer className="relative border-t border-border/60">
        <div className="container py-6 text-center text-xs text-muted-foreground">
          Built with the Web Crypto API - your files and keys never leave this browser.
        </div>
      </footer>
    </div>
  );
};

export default Index;