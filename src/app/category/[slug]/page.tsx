"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

import type { Category, Product } from "../../components/navbar-types";

const API_BASE = "https://openapi.programming-hero.com/api/bazardor";

type SortOption = "default" | "asc" | "desc";
type ApiRecord = Record<string, unknown>;

function unwrapData(response: unknown): unknown {
  let current = response;

  for (let i = 0; i < 3; i++) {
    if (
      current &&
      typeof current === "object" &&
      !Array.isArray(current) &&
      "data" in current
    ) {
      current = (current as ApiRecord).data;
    } else {
      break;
    }
  }

  return current;
}

function getProducts(response: unknown): Product[] {
  const data = unwrapData(response);

  if (Array.isArray(data)) return data as Product[];

  if (data && typeof data === "object") {
    const record = data as ApiRecord;

    for (const key of ["products", "items", "results"]) {
      if (Array.isArray(record[key])) {
        return record[key] as Product[];
      }
    }
  }

  return [];
}

function toNumber(value: number | string | undefined): number {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : 0;
  }

  const bengaliDigits = "০১২৩৪৫৬৭৮৯";
  const arabicDigits = "٠١٢٣٤٥٦٧٨٩";

  const normalized = String(value ?? "")
    .replace(/[০-৯]/g, (digit) => String(bengaliDigits.indexOf(digit)))
    .replace(/[٠-٩]/g, (digit) => String(arabicDigits.indexOf(digit)))
    .replace(/,/g, "")
    .replace(/[^\d.-]/g, "");

  const number = Number(normalized);
  return Number.isFinite(number) ? number : 0;
}

function formatNumber(value: number | string | undefined): string {
  return toNumber(value).toLocaleString("bn-BD", {
    maximumFractionDigits: 2,
  });
}

function getChange(product: Product) {
  const direction = product.change?.dir?.toLowerCase();
  const percentage = toNumber(product.change?.pct);

  if (direction === "up" || direction === "▲") {
    return { text: `▲ ${formatNumber(percentage)}%`, type: "up" };
  }

  if (direction === "down" || direction === "▼") {
    return { text: `▼ ${formatNumber(percentage)}%`, type: "down" };
  }

  return { text: "— ০%", type: "same" };
}

function CategoryPageContent() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;

  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [sort, setSort] = useState<SortOption>("default");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!slug) return;

    const controller = new AbortController();

    async function fetchCategoryProducts() {
      setLoading(true);
      setError(false);
      setCategory(null);
      setProducts([]);

      try {
        const encodedSlug = encodeURIComponent(slug);

        const [categoryResponse, productsResponse] = await Promise.all([
          fetch(`${API_BASE}/categories/${encodedSlug}`, {
            signal: controller.signal,
            cache: "no-store",
          }),
          fetch(`${API_BASE}/products?category=${encodedSlug}`, {
            signal: controller.signal,
            cache: "no-store",
          }),
        ]);

        if (!categoryResponse.ok || !productsResponse.ok) {
          throw new Error("API request failed");
        }

        const categoryJson: unknown = await categoryResponse.json();
        const productsJson: unknown = await productsResponse.json();

        const categoryData = unwrapData(categoryJson);

        if (
          !categoryData ||
          typeof categoryData !== "object" ||
          Array.isArray(categoryData)
        ) {
          throw new Error("Invalid category response");
        }

        const foundCategory = categoryData as Category;
        const foundProducts = getProducts(productsJson);

        if (!foundCategory.slug || foundCategory.slug !== slug) {
          throw new Error("Category slug does not match");
        }

        setCategory(foundCategory);
        setProducts(foundProducts);
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") return;

        console.error("Category fetch error:", err);
        setError(true);
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchCategoryProducts();

    return () => controller.abort();
  }, [slug]);

  const sortedProducts = useMemo(() => {
    const list = [...products];

    if (sort === "asc") {
      list.sort((a, b) => toNumber(a.today) - toNumber(b.today));
    }

    if (sort === "desc") {
      list.sort((a, b) => toNumber(b.today) - toNumber(a.today));
    }

    return list;
  }, [products, sort]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f0f5f0] px-4 py-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-5 h-24 animate-pulse rounded-2xl bg-white" />
          <p className="mb-5 text-sm text-gray-500">
            ক্যাটাগরির তথ্য লোড হচ্ছে...
          </p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="h-32 animate-pulse rounded-xl bg-white"
              />
            ))}
          </div>
        </div>
      </main>
    );
  }

  if (error || !category) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center bg-[#f0f5f0] px-4 py-10">
        <div className="w-full max-w-md rounded-2xl border border-[#e3eae3] bg-white p-8 text-center">
          <div className="mb-3 text-5xl">🛒</div>
          <h1 className="text-xl font-extrabold text-[#253027]">
            ক্যাটাগরি খুঁজে পাওয়া যায়নি
          </h1>
          <p className="mt-2 text-sm leading-6 text-gray-500">
            ক্যাটাগরির তথ্য আনতে সমস্যা হয়েছে। আবার চেষ্টা করো অথবা হোম পেজে
            ফিরে যাও।
          </p>
          <Link
            href="/"
            className="mt-5 inline-flex rounded-lg bg-green-700 px-5 py-3 text-sm font-bold text-white transition hover:bg-green-800"
          >
            হোম পেজে ফিরে যান
          </Link>
        </div>
      </main>
    );
  }

  if (products.length === 0) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center bg-[#f0f5f0] px-4 py-10">
        <div className="w-full max-w-md rounded-2xl border border-[#e3eae3] bg-white p-8 text-center">
          <div className="mb-3 text-5xl">{category.icon || "🛒"}</div>
          <h1 className="text-xl font-extrabold text-[#253027]">
            এই ক্যাটাগরিতে কোনো পণ্য নেই
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            অন্য পণ্য দেখতে হোম পেজে ফিরে যাও।
          </p>
          <Link
            href="/"
            className="mt-5 inline-flex rounded-lg bg-green-700 px-5 py-3 text-sm font-bold text-white hover:bg-green-800"
          >
            হোম পেজে ফিরে যান
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f0f5f0] px-3 py-6 sm:px-5 sm:py-8">
      <div className="mx-auto max-w-7xl space-y-6 sm:space-y-8">
        <header className="flex items-center gap-4 rounded-2xl border border-[#e3eae3] bg-[#fafcf9] p-5 sm:p-7">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#eaf4eb] text-4xl sm:h-20 sm:w-20 sm:text-5xl">
            {category.icon || "🛒"}
          </div>

          <div className="min-w-0">
            <h1 className="text-xl font-extrabold text-[#253027] sm:text-3xl">
              {category.nameBn}
            </h1>
            <p className="mt-2 text-sm leading-6 text-gray-600">
              প্রতিদিনের বাজারের পণ্যের দাম ও পরিবর্তন
            </p>
          </div>
        </header>

        <section className="flex flex-col gap-3 rounded-xl border border-[#e3eae3] bg-white p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <div>
            <h2 className="font-bold text-[#253027]">পণ্য সাজান</h2>
            <p className="mt-1 text-xs text-gray-500">
              মোট {formatNumber(sortedProducts.length)}টি পণ্য
            </p>
          </div>

          <select
            aria-label="পণ্য সাজান"
            value={sort}
            onChange={(event) => setSort(event.target.value as SortOption)}
            className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100 sm:w-64"
          >
            <option value="default">ডিফল্ট</option>
            <option value="asc">দাম: কম থেকে বেশি</option>
            <option value="desc">দাম: বেশি থেকে কম</option>
          </select>
        </section>

        <section>
          <h2 className="mb-4 text-lg font-extrabold text-[#253027]">
            {category.nameBn} — সব পণ্য
          </h2>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {sortedProducts.map((product) => {
              const change = getChange(product);

              return (
                <Link
                  href={`/product/${product.slug || product.id}`}
                  className="group rounded-xl border border-[#e3eae3] bg-[#fafcf9] p-4 transition hover:-translate-y-0.5 hover:border-green-300 hover:shadow-md"
                  key={product.id}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#edf4ed] text-2xl">
                      {product.categoryIcon || category.icon || "🛒"}
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="truncate font-bold text-[#273129] group-hover:text-green-700">
                        {product.nameBn}
                      </h3>
                      <p className="mt-1 text-xs text-gray-500">
                        {product.unit || "প্রতি একক"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 flex items-end justify-between gap-2">
                    <div>
                      <p className="text-xs text-gray-500">আজকের দাম</p>
                      <p className="mt-1 text-base font-extrabold text-[#218b45]">
                        {formatNumber(product.today)} টাকা
                      </p>
                    </div>

                    <span
                      className={`shrink-0 rounded-full px-2.5 py-1.5 text-xs font-bold ${
                        change.type === "up"
                          ? "bg-red-50 text-red-600"
                          : change.type === "down"
                            ? "bg-green-50 text-green-700"
                            : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {change.text}
                    </span>
                  </div>

                  <div className="mt-4 border-t border-gray-100 pt-3 text-xs font-semibold text-green-700">
                    বিস্তারিত দেখুন →
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}

export default function CategoryPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[#f0f5f0] px-4 py-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-5 h-24 animate-pulse rounded-2xl bg-white" />
            <p className="text-sm text-gray-500">
              ক্যাটাগরির তথ্য লোড হচ্ছে...
            </p>
          </div>
        </main>
      }
    >
      <CategoryPageContent />
    </Suspense>
  );
}
