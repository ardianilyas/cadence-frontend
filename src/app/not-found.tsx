import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex items-center max-w-xl mx-auto justify-center min-h-screen">
      <div className="text-center">
        <h1 className="font-bold text-7xl">404</h1>
        <p className="font-light text-neutral-900/80 leading-relaxed mb-4">Oops… this page took a wrong turn. It might be off exploring the internet somewhere. Let’s get you back on track.</p>
        <Link href="/">
          <Button>
            <ArrowLeft />
            Go back to home
          </Button>
        </Link>
      </div>
    </div>
  )
}