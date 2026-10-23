import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export default function AuthLayout({ children }: Props) {
  return (
    <div className="min-h-screen flex justify-center items-center">
      <div className="max-w-md w-full mx-8 bg-zinc-100/20 backdrop-blur rounded-xl shadow-md p-8">
        {children}
      </div>
    </div>
  );
}
