"use client";

import { Suspense } from "react";
import { usePearlvine } from "@/context/PearlvineContext";
import RegisterForm from "@/components/features/auth/RegisterForm";

export default function RegisterPage() {
  const { isWeb3Connected } = usePearlvine();

  if (isWeb3Connected) {
    return null;
  }

  return (
    <Suspense
      fallback={
        <div className="py-16 text-center text-sm text-slate-500">Loading...</div>
      }
    >
      <RegisterForm />
    </Suspense>
  );
}
