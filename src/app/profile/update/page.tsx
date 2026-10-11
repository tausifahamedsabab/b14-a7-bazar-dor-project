"use client";

import { authClient } from "../../../lib/auth-client";
import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function UpdateProfilePage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.replace("/signin");
    }
  }, [isPending, session?.user, router]);

  if (isPending || !session?.user) {
    return (
      <main className="min-h-[60vh] bg-[#f0f5f0] px-4 py-12">
        <div className="mx-auto max-w-2xl animate-pulse space-y-4">
          <div className="h-8 w-56 rounded bg-gray-200" />
          <div className="h-48 rounded-2xl bg-white" />
        </div>
      </main>
    );
  }

  return (
    <UpdateProfileForm
      initialName={session.user.name ?? ""}
      email={session.user.email}
      onBack={() => router.push("/profile")}
    />
  );
}

function UpdateProfileForm({
  initialName,
  email,
  onBack,
}: {
  initialName: string;
  email: string;
  onBack: () => void;
}) {
  const router = useRouter();

  const [name, setName] = useState(initialName);
  const [saving, setSaving] = useState(false);

  async function handleUpdate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedName = name.trim();

    if (trimmedName.length < 2) {
      toast.error("নাম কমপক্ষে ২ অক্ষরের হতে হবে");
      return;
    }

    setSaving(true);

    try {
      const result = await authClient.updateUser({
        name: trimmedName,
      });

      if (result.error) {
        toast.error("নাম আপডেট করা যায়নি");
        return;
      }

      toast.success("তথ্য সফলভাবে আপডেট হয়েছে");
      router.push("/profile");
    } catch {
      toast.error("আপডেট করার সময় সমস্যা হয়েছে");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="min-h-[60vh] bg-[#f0f5f0] px-4 py-12">
      <div className="mx-auto max-w-2xl">
        <button
          type="button"
          onClick={onBack}
          className="mb-5 text-sm font-medium text-green-800 hover:underline"
        >
          ← প্রোফাইলে ফিরে যান
        </button>

        <h1 className="mb-2 text-2xl font-bold text-gray-900">
          Update Information
        </h1>

        <p className="mb-6 text-sm text-gray-500">
          আপনার অ্যাকাউন্টের নাম পরিবর্তন করুন।
        </p>

        <section className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
          <form onSubmit={handleUpdate} className="space-y-5">
            <div>
              <label
                htmlFor="update-name"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Name
              </label>

              <input
                id="update-name"
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                minLength={2}
                maxLength={100}
                required
                autoComplete="name"
                placeholder="আপনার নাম লিখুন"
                className="w-full rounded-lg border border-gray-200 px-3 py-3 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
              />
            </div>

            <div>
              <label
                htmlFor="update-email"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Email
              </label>

              <input
                id="update-email"
                type="email"
                value={email}
                readOnly
                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-3 text-gray-500"
              />

              <p className="mt-1 text-xs text-gray-500">
                এই ফর্মে শুধু নাম পরিবর্তন করা যাবে।
              </p>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full rounded-lg bg-green-700 px-4 py-3 font-semibold text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? "আপডেট হচ্ছে..." : "Update Information"}
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
