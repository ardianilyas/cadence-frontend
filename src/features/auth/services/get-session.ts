import { authClient } from "@/lib/auth-client";

export async function getSession() {
  const { data, error } = await authClient.getSession();

  if (error) {
    throw new Error(error.message || "Failed to retrieve session");
  }

  if (!data) {
    throw new Error("No authenticated session found");
  }

  return data;
}
