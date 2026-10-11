import Image from "next/image";

export default function Hero() {
  return (
    <section className="bg-[#f0f5f0] px-3 py-2 sm:px-5">
      <div className="mx-auto grid max-w-7xl grid-cols-[1fr_115px] items-center gap-2 overflow-hidden rounded-2xl border border-[#e3eae3] bg-[#fafcf9] px-3 py-4 sm:grid-cols-[1fr_180px] sm:gap-5 sm:px-5 sm:py-5 md:px-7">
        {/* Left Content */}
        <div className="min-w-0">
          <p className="mb-2 inline-flex rounded-full border border-green-200 bg-[#edf7ee] px-2 py-1 text-[9px] font-medium text-green-700 sm:text-[10px]">
            সোমবার, ৫ অক্টোবর, ২০২৬
          </p>

          <h1 className="text-lg font-extrabold leading-snug tracking-tight text-[#252d26] sm:text-2xl">
            আজকের বাজারের দাম এক নজরে
          </h1>

          <p className="mt-2 max-w-xl text-[10px] leading-[1.7] text-gray-500 sm:text-xs sm:leading-5">
            চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম ও মসলার দাম — বাজারভিত্তিক
            বিশ্লেষণ, তথ্য, সর্বশেষ বাজারদর এক জায়গায় সহজেই জেনে নিন।
          </p>

          <a
            href="#সব-পণ্য"
            className="mt-3 inline-flex items-center justify-center rounded-md bg-[#218b45] px-3 py-2 text-[10px] font-bold text-white shadow-sm transition-colors hover:bg-green-800 sm:mt-4 sm:px-4 sm:text-xs"
          >
            সব পণ্য দেখুন
          </a>
        </div>

        {/* Right Banner Image */}
        <div className="relative flex h-28 w-full items-center justify-center sm:h-36">
          <Image
            src="/banner.png"
            alt="তাজা শাকসবজির ঝুড়ি"
            width={240}
            height={200}
            priority
            className="h-full w-full object-contain"
            sizes="(max-width: 640px) 115px, 180px"
          />
        </div>
      </div>
    </section>
  );
}
