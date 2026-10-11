
import Image from "next/image";

export default function Hero() {
  return (
    <section className="bg-[#f0f5f0] px-4 py-2 sm:px-6">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-3 overflow-hidden rounded-2xl border border-[#e1e9e1] bg-[#fafcf9] px-5 py-5 sm:px-7 md:grid-cols-[1fr_180px] md:gap-6 md:px-8 md:py-5">

        {/* Left Content */}
        <div>
          <p className="mb-2 inline-flex rounded-full border border-green-200 bg-[#edf7ee] px-2.5 py-1 text-[10px] font-medium text-green-700">
            সোমবার, ৫ অক্টোবর, ২০২৬
          </p>

          <h1 className="text-xl font-extrabold leading-tight tracking-tight text-[#252d26] sm:text-2xl">
            আজকের বাজারের দাম এক নজরে
          </h1>

          <p className="mt-2 max-w-xl text-xs leading-5 text-gray-500">
            চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম ও মসলার দাম —
            বাজারভিত্তিক বিশ্লেষণ, তথ্য, সর্বশেষ বাজারদর এক জায়গায়
            সহজেই জেনে নিন।
          </p>

          <a
            href="#সব-পণ্য"
            className="mt-4 inline-flex items-center justify-center rounded-md bg-green-700 px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-green-800"
          >
            সব পণ্য দেখুন
          </a>
        </div>

        {/* Right Image */}
        <div className="relative mx-auto flex h-32 w-40 items-center justify-center md:h-32 md:w-40">
          <Image
            src="/banner.png"
            alt="তাজা শাকসবজির ঝুড়ি"
            width={240}
            height={200}
            priority
            className="h-full w-full object-contain"
          />
        </div>

      </div>
    </section>
  );
}
