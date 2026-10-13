"use client"

import { Button } from "@/components/ui/button";
import { GitBranch } from "lucide-react";
import { useEffect, useState } from "react";
import { signInWithGithub } from "@/features/auth/services/sign-in-with-github";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

export default function SignInPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const error = searchParams.get("error");
    if (error) {
      toast.error(
        error === "access_denied" ? "Sign in failed" : "Unable to sign in with GitHub"
      );
      router.replace("/sign-in");
    }
  }, [searchParams]);

  async function handleSignIn() {
    setLoading(true);
    setError(null);

    try {
      await signInWithGithub();
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Unable to sign in with GitHub",
      );
      setLoading(false)
    }
  }
  return (
    <>
      <h1 className="text-lg font-medium">Welcome back</h1>
      <p className="text-sm text-neutral-900/70 font-light">Sign in to pick up right where you left off</p>
      <Button onClick={handleSignIn} disabled={loading} className="w-full mt-4" variant="outline" size="lg">
        <GitBranch />
        Sign in with GitHub
      </Button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </>
  )
}