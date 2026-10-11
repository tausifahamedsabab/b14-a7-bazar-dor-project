import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-[65vh] items-center justify-center px-4 py-16">
      <div className="w-full max-w-md rounded-3xl border border-[#e1e9e1] bg-white p-8 text-center shadow-sm sm:p-10">
        <div className="mb-5 text-6xl" aria-hidden="true">
          🔎
        </div>

        <p className="mb-2 text-sm font-bold uppercase tracking-widest text-green-700">
          Error 404
        </p>

        <h1 className="text-2xl font-extrabold text-[#202a22] sm:text-3xl">
          পেজটি খুঁজে পাওয়া যায়নি!
        </h1>

        <p className="mt-3 text-sm leading-7 text-gray-500">
          দুঃখিত, এই পেজটি পাওয়া যাচ্ছে না। পণ্যের নাম অথবা ক্যাটাগরির ঠিকানা
          পরীক্ষা করে আবার চেষ্টা করো।
        </p>

        <Link
          href="/"
          className="mt-7 inline-flex min-h-11 items-center justify-center rounded-xl bg-green-700 px-6 py-3 text-sm font-bold text-white transition hover:bg-green-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-700"
        >
          হোম পেজে ফিরে যান
        </Link>
      </div>
    </main>
  );
}
