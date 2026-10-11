"use client";

import { authClient } from "../../lib/auth-client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.replace("/signin");
    }
  }, [isPending, session, router]);

  if (isPending || !session?.user) {
    return (
      <main className="min-h-[60vh] bg-[#f0f5f0] px-4 py-12">
        <div className="mx-auto max-w-2xl animate-pulse space-y-4">
          <div className="h-8 w-48 rounded bg-gray-200" />
          <div className="h-36 rounded-2xl bg-white" />
        </div>
      </main>
    );
  }

  const user = session.user;

  return (
    <main className="min-h-[60vh] bg-[#f0f5f0] px-4 py-12">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-2 text-2xl font-bold text-gray-900">আমার প্রোফাইল</h1>

        <p className="mb-6 text-sm text-gray-500">
          আপনার অ্যাকাউন্টের তথ্য দেখুন ও আপডেট করুন।
        </p>

        <section className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-5">
          {user.image ? (
            <img
              src={user.image}
              alt="Profile"
              className="h-16 w-16 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-green-100 text-2xl font-bold text-green-800">
              {user.name?.charAt(0).toUpperCase() || "U"}
            </div>
          )}

          <div className="min-w-0 flex-1">
            <h2 className="break-words font-semibold text-gray-900">
              {user.name}
            </h2>
            <p className="break-all text-sm text-gray-500">{user.email}</p>
          </div>
        </section>

        <section className="mt-4 rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
          <h2 className="mb-2 font-semibold text-gray-900">ব্যক্তিগত তথ্য</h2>

          <p className="mb-5 text-sm text-gray-500">
            আপনার নাম পরিবর্তন করতে Update button-এ ক্লিক করুন।
          </p>

          <button
            type="button"
            onClick={() => router.push("/profile/update")}
            className="w-full rounded-lg bg-green-700 px-4 py-3 font-medium text-white transition hover:bg-green-800"
          >
            Update
          </button>
        </section>
      </div>
    </main>
  );
}
