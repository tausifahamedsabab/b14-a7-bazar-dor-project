"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

export default function SignUpForm() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (name.trim().length < 2) {
      toast.error("নাম কমপক্ষে ২ অক্ষরের হতে হবে");
      return;
    }

    if (password.length < 8) {
      toast.error("পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("দুটি পাসওয়ার্ড মিলছে না");
      return;
    }

    setLoading(true);

    try {
      const result = await authClient.signUp.email({
        name: name.trim(),
        email: email.trim(),
        password,
        callbackURL: "/",
      });

      if (result.error) {
        toast.error(result.error.message || "অ্যাকাউন্ট তৈরি করা যায়নি");
        return;
      }

      toast.success("অ্যাকাউন্ট তৈরি হয়েছে। এবার সাইন ইন করুন।");
      router.replace("/signin");
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

  const inputClass =
    "w-full rounded-lg border border-gray-200 px-3 py-2.5 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100";

  return (
    <section className="w-full max-w-md rounded-2xl border border-[#e2e9e2] bg-white p-6 shadow-sm sm:p-8">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-[#202b22]">
          অ্যাকাউন্ট তৈরি করুন
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          বাজারদরের সুবিধা পেতে রেজিস্ট্রেশন করুন।
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="signup-name" className="mb-1 block text-sm">
            নাম
          </label>
          <input
            id="signup-name"
            required
            minLength={2}
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="আপনার নাম"
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="signup-email" className="mb-1 block text-sm">
            ইমেইল
          </label>
          <input
            id="signup-email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="signup-password" className="mb-1 block text-sm">
            পাসওয়ার্ড
          </label>
          <input
            id="signup-password"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="কমপক্ষে ৮ অক্ষর"
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="confirm-password" className="mb-1 block text-sm">
            পাসওয়ার্ড নিশ্চিত করুন
          </label>
          <input
            id="confirm-password"
            type="password"
            required
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="আবার পাসওয়ার্ড লিখুন"
            className={inputClass}
          />
        </div>

        <button
          disabled={loading}
          className="w-full rounded-lg bg-green-700 px-4 py-3 font-medium text-white hover:bg-green-800 disabled:opacity-60"
        >
          {loading ? "অপেক্ষা করুন..." : "অ্যাকাউন্ট তৈরি করুন"}
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
        অ্যাকাউন্ট আছে?{" "}
        <Link
          href="/signin"
          className="font-medium text-green-700 hover:underline"
        >
          সাইন ইন করুন
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
