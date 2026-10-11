"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { authClient } from "../../../lib/auth-client";

export default function UserMenu() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);

    try {
      const result = await authClient.signOut();

      if (result.error) {
        toast.error(result.error.message || "Logout করা যায়নি");
        return;
      }

      toast.success("সফলভাবে Logout হয়েছে");
      setOpen(false);
      router.replace("/");
      router.refresh();
    } catch {
      toast.error("Logout করার সময় সমস্যা হয়েছে");
    } finally {
      setLoading(false);
    }
  }

  if (isPending) {
    return <div className="h-9 w-24 animate-pulse rounded-lg bg-gray-200" />;
  }

  if (!session?.user) {
    return (
      <div className="flex items-center gap-3">
        <Link
          href="/signin"
          className="rounded-lg px-3 py-2 text-sm hover:text-green-700"
        >
          সাইন ইন
        </Link>

        <Link
          href="/signup"
          className="rounded-lg bg-green-700 px-4 py-2 text-sm text-white hover:bg-green-800"
        >
          সাইন আপ
        </Link>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2"
      >
        {session.user.image ? (
          <img
            src={session.user.image}
            alt=""
            className="h-8 w-8 rounded-full object-cover"
          />
        ) : (
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 font-semibold text-green-800">
            {session.user.name?.charAt(0).toUpperCase() || "U"}
          </span>
        )}

        <span className="max-w-28 truncate text-sm">{session.user.name}</span>

        <span>⌄</span>
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-64 rounded-xl border border-gray-200 bg-white p-4 shadow-lg">
          <p className="font-semibold">{session.user.name}</p>

          <p className="mt-1 break-all text-xs text-gray-500">
            {session.user.email}
          </p>

          <hr className="my-3" />

          <Link
            href="/profile"
            onClick={() => setOpen(false)}
            className="block rounded-lg px-3 py-2 text-sm hover:bg-gray-50"
          >
            আমার প্রোফাইল
          </Link>

          <button
            type="button"
            disabled={loading}
            onClick={handleLogout}
            className="mt-1 w-full rounded-lg px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 disabled:opacity-60"
          >
            {loading ? "অপেক্ষা করুন..." : "সাইন আউট"}
          </button>
        </div>
      )}
    </div>
  );
}
