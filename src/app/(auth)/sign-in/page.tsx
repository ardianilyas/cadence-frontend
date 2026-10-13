import SignInPage from "@/features/auth/components/SignInPage";
import { Suspense } from "react";

export default function SignIn() {
  return (
    <Suspense fallback={null}>
      <SignInPage />
    </Suspense>
  )
}