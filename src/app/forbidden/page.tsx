import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function ForbiddenPage() {
  return (
    <div className="flex items-center max-w-xl mx-auto px-8 justify-center min-h-screen">
      <div className="text-center">
        <h1 className="font-bold text-7xl">403</h1>
        <p className="text-sm sm:text-lg font-light text-neutral-900/80 leading-relaxed mb-4">
          You don't have permission to access this resource.
        </p>
        <Link href="/dashboard">
          <Button>
            <ArrowLeft />
            Go back to home
          </Button>
        </Link>
      </div>
    </div>
  );
}
