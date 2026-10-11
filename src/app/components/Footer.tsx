export default function Footer() {
  return (
    <footer className="mt-auto w-full border-t border-[#e1e9e1] bg-[#fbfdfb]">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-4 py-5 sm:px-6 sm:py-6 md:flex-row md:items-center md:justify-between lg:px-8">
        <p className="text-sm font-bold leading-6 text-[#202a22] sm:text-base">
          বাজার দর — প্রয়োজনীয় পণ্যের দাম এক নজরে।
        </p>

        <p className="text-xs leading-5 text-gray-500 sm:text-sm md:max-w-md md:text-right">
          সকল দাম সম্ভাব্য; বাজার অবস্থার ওপর নির্ভর করে পরিবর্তিত হয়।
        </p>
      </div>
    </footer>
  );
}
