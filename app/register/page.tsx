"use client";

import React from "react";
import { usePearlvine } from "@/context/PearlvineContext";
import RegisterForm from "@/components/features/auth/RegisterForm";

export default function RegisterPage() {
  const { isWeb3Connected } = usePearlvine();

  if (isWeb3Connected) {
    return null;
  }

  return <RegisterForm />;
}
