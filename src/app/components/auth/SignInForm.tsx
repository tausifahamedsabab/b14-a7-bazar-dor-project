"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

export default function SignInForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!email.trim() || !password) {
      toast.error("ইমেইল ও পাসওয়ার্ড লিখুন");
      return;
    }

    setLoading(true);

    try {
      const result = await authClient.signIn.email({
        email: email.trim(),
        password,
        callbackURL: "/",
      });

      if (result.error) {
        toast.error(result.error.message || "সাইন ইন করা যায়নি");
        return;
      }

      toast.success("সফলভাবে সাইন ইন হয়েছে");
      router.replace("/");
      router.refresh();
    } catch {
      toast.error("সমস্যা হয়েছে। আবার চেষ্টা করুন।");
    } finally {
      setLoading(false);
    }
  }

  async function handleSocialLogin(provider: "google" | "github") {
    setLoading(true);

    try {
      const result = await authClient.signIn.social({
        provider,
        callbackURL: "/",
      });

      if (result.error) {
        toast.error(result.error.message || "Social login ব্যর্থ হয়েছে");
        setLoading(false);
      }
    } catch {
      toast.error("Social login করা যায়নি");
      setLoading(false);
    }
  }

  return (
    <section className="w-full max-w-md rounded-2xl border border-[#e2e9e2] bg-white p-6 shadow-sm sm:p-8">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-[#202b22]">সাইন ইন</h1>
        <p className="mt-2 text-sm text-gray-500">
          বাজারদর ও আপনার প্রোফাইল দেখতে সাইন ইন করুন।
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="signin-email" className="mb-1 block text-sm">
            ইমেইল
          </label>
          <input
            id="signin-email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full rounded-lg border border-gray-200 px-3 py-2.5 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
          />
        </div>

        <div>
          <label htmlFor="signin-password" className="mb-1 block text-sm">
            পাসওয়ার্ড
          </label>
          <input
            id="signin-password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="আপনার পাসওয়ার্ড"
            className="w-full rounded-lg border border-gray-200 px-3 py-2.5 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
          />
        </div>

        <button
          disabled={loading}
          className="w-full rounded-lg bg-green-700 px-4 py-3 font-medium text-white hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "অপেক্ষা করুন..." : "সাইন ইন"}
        </button>
      </form>

      <div className="my-5 flex items-center gap-3 text-xs text-gray-400">
        <div className="h-px flex-1 bg-gray-200" />
        অথবা
        <div className="h-px flex-1 bg-gray-200" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          disabled={loading}
          onClick={() => handleSocialLogin("google")}
          className="rounded-lg border border-gray-200 px-3 py-2.5 text-sm hover:bg-gray-50 disabled:opacity-60"
        >
          Google দিয়ে
        </button>

        <button
          type="button"
          disabled={loading}
          onClick={() => handleSocialLogin("github")}
          className="rounded-lg border border-gray-200 px-3 py-2.5 text-sm hover:bg-gray-50 disabled:opacity-60"
        >
          GitHub দিয়ে
        </button>
      </div>

      <p className="mt-6 text-center text-sm text-gray-600">
        অ্যাকাউন্ট নেই?{" "}
        <Link
          href="/signup"
          className="font-medium text-green-700 hover:underline"
        >
          সাইন আপ করুন
        </Link>
      </p>

      <p className="mt-4 text-center">
        <Link href="/" className="text-sm text-gray-500 hover:text-green-700">
          ← হোম পেজে ফিরে যান
        </Link>
      </p>
    </section>
  );
}
