"use client";

import React from "react";
import { usePearlvine } from "@/context/PearlvineContext";
import LoginForm from "@/components/features/auth/LoginForm";

export default function LoginPage() {
  const { isWeb3Connected } = usePearlvine();

  if (isWeb3Connected) {
    return null;
  }

  return <LoginForm />;
}
