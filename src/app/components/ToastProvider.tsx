"use client";

import { Toaster } from "react-hot-toast";

export default function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 5000,
        style: {
          borderRadius: "12px",
          background: "#202a22",
          color: "#fff",
          padding: "12px 16px",
        },
        success: {
          duration: 5000,
        },
        error: {
          duration: 5000,
        },
      }}
    />
  );
}
