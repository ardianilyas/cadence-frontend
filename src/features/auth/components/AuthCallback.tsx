"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSession } from "../services/get-session";
import { useAuthStore } from "../store/auth-store";

export function AuthCallback() {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function handleCallback() {
      try {
        const { user } = await getSession();

        if (cancelled) return;

        setUser({
          username: user.name,
          email: user.email,
          avatar: user.image ?? "",
        });

        router.replace("/dashboard");
      } catch (err) {
        if (cancelled) return;

        setError(
          err instanceof Error
            ? err.message
            : "Authentication failed",
        );
      }
    }

    void handleCallback();

    return () => {
      cancelled = true;
    };
  }, [router, setUser]);

  if (error) {
    return (
      <div className="space-y-3 text-center">
        <p role="alert">{error}</p>
        <button
          onClick={() => router.replace("/login")}
          className="underline"
        >
          Back to login
        </button>
      </div>
    );
  }

  return <p>Completing sign-in...</p>;
}