"use client";

import { authClient } from "../../lib/auth-client";
import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const [editedName, setEditedName] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.replace("/signin");
    }
  }, [isPending, session, router]);

  const currentName = session?.user?.name ?? "";
  const name = editedName ?? currentName;

  async function handleUpdate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (name.trim().length < 2) {
      toast.error("নাম কমপক্ষে ২ অক্ষরের হতে হবে");
      return;
    }

    setSaving(true);

    try {
      const result = await authClient.updateUser({
        name: name.trim(),
      });

      if (result.error) {
        toast.error(result.error.message || "প্রোফাইল আপডেট হয়নি");
        return;
      }

      setEditedName(null);
      toast.success("প্রোফাইল আপডেট হয়েছে");
    } catch {
      toast.error("আপডেট করার সময় সমস্যা হয়েছে");
    } finally {
      setSaving(false);
    }
  }

  if (isPending || !session?.user) {
    return (
      <main className="min-h-[60vh] bg-[#f0f5f0] px-4 py-12">
        <div className="mx-auto max-w-2xl animate-pulse space-y-4">
          <div className="h-8 w-48 rounded bg-gray-200" />
          <div className="h-36 rounded-2xl bg-white" />
          <div className="h-48 rounded-2xl bg-white" />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-[60vh] bg-[#f0f5f0] px-4 py-12">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-2 text-2xl font-bold text-gray-900">আমার প্রোফাইল</h1>

        <p className="mb-6 text-sm text-gray-500">
          আপনার অ্যাকাউন্টের তথ্য দেখুন ও আপডেট করুন।
        </p>

        <section className="mb-4 flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-5">
          {session.user.image ? (
            <img
              src={session.user.image}
              alt=""
              className="h-16 w-16 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-2xl font-bold text-green-800">
              {currentName.charAt(0).toUpperCase() || "U"}
            </div>
          )}

          <div className="min-w-0">
            <h2 className="font-semibold text-gray-900">{currentName}</h2>
            <p className="break-all text-sm text-gray-500">
              {session.user.email}
            </p>
          </div>
        </section>

        <section className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
          <h2 className="mb-5 font-semibold">ব্যক্তিগত তথ্য</h2>

          <form onSubmit={handleUpdate} className="space-y-4">
            <div>
              <label htmlFor="profile-name" className="mb-1 block text-sm">
                নাম
              </label>

              <input
                id="profile-name"
                value={name}
                onChange={(event) => setEditedName(event.target.value)}
                minLength={2}
                required
                className="w-full rounded-lg border border-gray-200 px-3 py-2.5 outline-none focus:border-green-600"
              />
            </div>

            <div>
              <label htmlFor="profile-email" className="mb-1 block text-sm">
                ইমেইল
              </label>

              <input
                id="profile-email"
                value={session.user.email}
                readOnly
                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-gray-500"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full rounded-lg bg-green-700 px-4 py-3 font-medium text-white hover:bg-green-800 disabled:opacity-60"
            >
              {saving ? "আপডেট হচ্ছে..." : "আপডেট"}
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
