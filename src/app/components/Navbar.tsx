"use client";

import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";

import UserMenu from "./auth/UserMenu";
import CategoryNav from "./CategoryNav";
import PriceTicker from "./PriceTicker";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#e1e9e1] bg-[#fbfdfb] text-[#202a22]">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-3 py-2.5 sm:px-6 sm:py-3 lg:px-8">
        <Link
          href="/"
          className="flex min-w-0 shrink-0 items-center gap-2"
          aria-label="বাজার দর হোম"
        >
          <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-xl sm:h-10 sm:w-10">
            <Image
              src="/logo.png"
              alt="বাজার দর"
              width={40}
              height={40}
              priority
              className="h-full w-full object-contain"
            />
          </div>

          <div className="min-w-0">
            <h1 className="text-sm font-extrabold leading-5 sm:text-base">
              বাজার দর
            </h1>
            <p className="mt-0.5 whitespace-nowrap text-[10px] text-gray-500 sm:text-xs">
              আজকের বাজারদর
            </p>
          </div>
        </Link>

        <div className="shrink-0">
          <UserMenu />
        </div>
      </div>

      <Suspense
        fallback={<div className="h-10" aria-label="Loading categories" />}
      >
        <CategoryNav />
      </Suspense>

      <PriceTicker />
    </header>
  );
}
