"use client";

import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";

import UserMenu from "./auth/UserMenu";
import CategoryNav from "./CategoryNav";
import PriceTicker from "./PriceTicker";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-[#e1e9e1] bg-[#fbfdfb] text-[#202a22]">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex items-center gap-2"
          aria-label="বাজার দর হোম"
        >
          <div className="relative h-10 w-10 overflow-hidden rounded-xl">
            <Image
              src="/logo.png"
              alt="বাজার দর"
              width={40}
              height={40}
              priority
              className="h-10 w-10 object-contain"
            />
          </div>

          <div>
            <h1 className="text-base font-extrabold leading-5">বাজার দর</h1>
            <p className="mt-1 text-[10px] text-gray-500">আজকের বাজারদর</p>
          </div>
        </Link>

        <UserMenu />
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
