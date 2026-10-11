"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Product } from "./navbar-types";

const API_URL = "https://openapi.programming-hero.com/api/bazardor/products";

function getChangeDirection(product: Product) {
  const direction = product.change?.dir?.toLowerCase();

  if (direction === "up" || direction === "▲") return "up";
  if (direction === "down" || direction === "▼") return "down";

  return "neutral";
}

function formatNumber(value: number | string | undefined) {
  if (value === undefined || value === "") return "—";

  const number = Number(value);

  if (!Number.isFinite(number)) return String(value);

  return new Intl.NumberFormat("bn-BD", {
    maximumFractionDigits: 2,
  }).format(number);
}

function getProductEmoji(product: Product) {
  if (product.categoryIcon) return product.categoryIcon;

  const name = product.nameBn;

  if (name.includes("চাল")) return "🍚";
  if (name.includes("ডাল")) return "🫘";
  if (name.includes("তেল")) return "🫙";
  if (name.includes("পেঁয়াজ") || name.includes("পেঁয়াজ")) return "🧅";
  if (name.includes("আলু")) return "🥔";
  if (name.includes("মরিচ")) return "🌶️";
  if (name.includes("মাছ")) return "🐟";
  if (name.includes("মাংস")) return "🍗";
  if (name.includes("ডিম")) return "🥚";
  if (name.includes("রসুন")) return "🧄";

  return "🛒";
}

function ProductCard({ product }: { product: Product }) {
  const direction = getChangeDirection(product);

  return (
    <Link
      href={`/product/${product.id}`}
      className="group rounded-xl border border-[#e3eae3] bg-[#fafcf9] p-3 transition hover:-translate-y-0.5 hover:border-green-300 hover:shadow-sm sm:p-4"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#eff4ef] text-xl">
          {getProductEmoji(product)}
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="truncate text-sm font-bold text-[#273129] group-hover:text-green-700">
            {product.nameBn}
          </h3>

          <p className="mt-0.5 text-[11px] text-gray-500">
            {product.unit || "একক উল্লেখ নেই"}
          </p>
        </div>
      </div>

      <div className="mt-4 flex items-end justify-between gap-2">
        <div>
          <p className="text-[10px] text-gray-500">আজকের বাজারদর</p>

          <p className="mt-1 text-sm font-extrabold text-[#252d26]">
            {formatNumber(product.today)} টাকা
          </p>
        </div>

        {product.change && (
          <span
            className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-bold ${
              direction === "up"
                ? "bg-red-50 text-red-600"
                : direction === "down"
                  ? "bg-green-50 text-green-700"
                  : "bg-gray-100 text-gray-500"
            }`}
          >
            {direction === "up" ? "▲" : direction === "down" ? "▼" : "—"}{" "}
            {formatNumber(product.change.pct)}%
          </span>
        )}
      </div>
    </Link>
  );
}

function ProductGrid({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-gray-300 p-5 text-sm text-gray-500">
        এই মুহূর্তে কোনো পণ্যের তথ্য পাওয়া যায়নি।
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

export default function ProductSections() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadProducts() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(API_URL, {
          method: "GET",
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("পণ্যের তথ্য লোড করা যায়নি।");
        }

        const result: unknown = await response.json();

        let list: Product[] = [];

        if (Array.isArray(result)) {
          list = result as Product[];
        } else if (result && typeof result === "object") {
          const body = result as Record<string, unknown>;

          if (Array.isArray(body.data)) {
            list = body.data as Product[];
          } else if (Array.isArray(body.products)) {
            list = body.products as Product[];
          } else if (body.data && typeof body.data === "object") {
            const nested = body.data as Record<string, unknown>;

            if (Array.isArray(nested.products)) {
              list = nested.products as Product[];
            }
          }
        }

        if (list.length === 0) {
          setProducts([]);
        } else {
          setProducts(list);
        }
      } catch (err) {
        if (err instanceof Error && err.name !== "AbortError") {
          setError(err.message);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadProducts();

    return () => controller.abort();
  }, []);

  const risingProducts = products
    .filter((product) => getChangeDirection(product) === "up")
    .slice(0, 6);

  const fallingProducts = products
    .filter((product) => getChangeDirection(product) === "down")
    .slice(0, 6);

  if (loading) {
    return (
      <section className="mx-auto max-w-7xl space-y-8 px-3 py-8 sm:px-5">
        {[1, 2, 3].map((section) => (
          <div key={section}>
            <div className="mb-4 h-5 w-40 animate-pulse rounded bg-gray-200" />

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((card) => (
                <div
                  key={card}
                  className="h-28 animate-pulse rounded-xl bg-white"
                />
              ))}
            </div>
          </div>
        ))}
      </section>
    );
  }

  if (error) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-10 text-center">
        <p className="text-sm text-red-600">{error}</p>

        <button
          onClick={() => window.location.reload()}
          className="mt-3 rounded-lg bg-green-700 px-4 py-2 text-sm font-semibold text-white hover:bg-green-800"
        >
          আবার চেষ্টা করো
        </button>
      </section>
    );
  }

  return (
    <section className="bg-[#f0f5f0] px-3 py-6 sm:px-5 sm:py-8">
      <div className="mx-auto max-w-7xl space-y-8 sm:space-y-10">
        {/* দাম বেড়েছে */}
        <section>
          <h2 className="mb-4 flex items-center gap-2 text-base font-extrabold text-[#252d26] sm:text-lg">
            <span className="text-red-500">▲</span>
            আজ দাম বেড়েছে
          </h2>

          <ProductGrid products={risingProducts} />
        </section>

        {/* দাম কমেছে */}
        <section>
          <h2 className="mb-4 flex items-center gap-2 text-base font-extrabold text-[#252d26] sm:text-lg">
            <span className="text-green-600">▼</span>
            আজ দাম কমেছে
          </h2>

          <ProductGrid products={fallingProducts} />
        </section>

        {/* সব পণ্য */}
        <section id="সব-পণ্য" className="scroll-mt-48">
          <h2 className="text-base font-extrabold text-[#252d26] sm:text-lg">
            সব পণ্য
          </h2>

          <p className="mb-4 mt-1 text-xs text-gray-500">
            মোট {formatNumber(products.length)}টি পণ্য দেখানো হচ্ছে
          </p>

          <ProductGrid products={products} />
        </section>
      </div>
    </section>
  );
}
