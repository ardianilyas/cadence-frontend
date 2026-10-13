import { authClient } from "@/lib/auth-client";

export async function signInWithGithub() {
  const { error } = await authClient.signIn.social({
    provider: "github",
    callbackURL: "http://localhost:3001/auth/callback",
    errorCallbackURL: "http://localhost:3001/sign-in",
  });

  if (error) throw new Error(error.message ?? "GitHub sign in failed");
}