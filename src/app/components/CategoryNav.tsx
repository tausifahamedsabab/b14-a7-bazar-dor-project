"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Category } from "./navbar-types";

const API_URL = "https://openapi.programming-hero.com/api/bazardor";

export default function CategoryNav() {
  const pathname = usePathname();
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    async function loadCategories() {
      try {
        const response = await fetch(`${API_URL}/categories`);
        if (!response.ok) throw new Error("Category fetch failed");

        const result: unknown = await response.json();

        let list: Category[] = [];

        if (Array.isArray(result)) {
          list = result as Category[];
        } else if (result && typeof result === "object") {
          const data = result as Record<string, unknown>;
          if (Array.isArray(data.data)) list = data.data as Category[];
          else if (Array.isArray(data.categories))
            list = data.categories as Category[];
        }

        setCategories(list);
      } catch (error) {
        console.error("Category API error:", error);
      }
    }

    loadCategories();
  }, []);

  return (
    <nav className="border-t border-[#edf1ed]">
      <div className="mx-auto flex max-w-7xl items-center gap-2 overflow-x-auto px-4 py-2 sm:justify-center sm:gap-4">
        {categories.map((category) => {
          const href = `/category/${category.slug}`;
          const active =
            pathname === href || pathname === `/category/${category.id}`;

          return (
            <Link
              key={category.id}
              href={href}
              className={`flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium ${
                active
                  ? "bg-green-100 text-green-800"
                  : "text-gray-700 hover:bg-green-50"
              }`}
            >
              <span>{category.icon}</span>
              <span>{category.nameBn}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
