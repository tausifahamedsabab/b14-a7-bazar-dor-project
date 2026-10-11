"use client";

import { useEffect } from "react";
import { Toaster, toast } from "react-hot-toast";
import { useSearchParams } from "next/navigation";

export default function ToastProvider() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const notice = searchParams.get("notice");

    if (notice === "auth-required") {
      toast.error("এই পেজটি দেখতে আগে Sign in করো।");
    }

    if (notice === "signed-in") {
      toast.success("সফলভাবে Sign in হয়েছে!");
    }

    if (notice === "signed-up") {
      toast.success("Account তৈরি হয়েছে!");
    }
  }, [searchParams]);

  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 3500,
        style: {
          borderRadius: "12px",
          background: "#202a22",
          color: "#fff",
        },
      }}
    />
  );
}
