"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

import type { Category, Product } from "../../components/navbar-types";

const API_BASE = "https://openapi.programming-hero.com/api/bazardor";

type SortOption = "default" | "asc" | "desc";

type ApiRecord = Record<string, unknown>;

// API response থেকে data বের করবে।
function unwrapData(response: unknown): unknown {
  let current = response;

  for (let i = 0; i < 3; i++) {
    if (current && typeof current === "object" && !Array.isArray(current)) {
      const record = current as ApiRecord;

      if ("data" in record) {
        current = record.data;
        continue;
      }
    }

    break;
  }

  return current;
}

// API response থেকে product array বের করবে।
function getProducts(response: unknown): Product[] {
  const data = unwrapData(response);

  if (Array.isArray(data)) {
    return data as Product[];
  }

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

// বাংলা ও ইংরেজি সংখ্যা দুটোই number-এ convert করবে।
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
  return toNumber(value).toLocaleString("bn-BD");
}

function getChange(product: Product) {
  const direction = product.change?.dir?.toLowerCase();
  const percentage = toNumber(product.change?.pct);

  if (direction === "up" || direction === "▲") {
    return {
      text: `▲ ${formatNumber(percentage)}%`,
      type: "up",
    };
  }

  if (direction === "down" || direction === "▼") {
    return {
      text: `▼ ${formatNumber(percentage)}%`,
      type: "down",
    };
  }

  return {
    text: "— ০%",
    type: "same",
  };
}

// useParams অবশ্যই Suspense-এর ভিতরের component-এ থাকবে।
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
          throw new Error(
            `API request failed: ${categoryResponse.status}, ${productsResponse.status}`,
          );
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
        if (err instanceof Error && err.name === "AbortError") {
          return;
        }

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

  // Default order অপরিবর্তিত থাকবে।
  // Ascending / descending-এ numeric price ব্যবহার হবে।
  const sortedProducts = useMemo(() => {
    const list = [...products];

    if (sort === "asc") {
      list.sort((a, b) => toNumber(a.today) - toNumber(b.today));
    } else if (sort === "desc") {
      list.sort((a, b) => toNumber(b.today) - toNumber(a.today));
    }

    return list;
  }, [products, sort]);

  if (loading) {
    return (
      <main className="category-page">
        <div className="category-container">
          <div className="skeleton category-heading-skeleton" />
          <div className="skeleton category-toolbar-skeleton" />

          <p className="loading-text">পণ্যের তথ্য লোড হচ্ছে...</p>

          <div className="product-grid">
            {Array.from({ length: 6 }).map((_, index) => (
              <div className="skeleton product-skeleton" key={index} />
            ))}
          </div>
        </div>
      </main>
    );
  }

  if (error || !category) {
    return (
      <main className="category-page">
        <div className="category-container empty-state">
          <div className="empty-icon">🛒</div>
          <h1>ক্যাটাগরি খুঁজে পাওয়া যায়নি</h1>
          <p>ক্যাটাগরির তথ্য আনতে সমস্যা হয়েছে। হোম পেজে ফিরে যাও।</p>
          <Link href="/" className="home-button">
            হোম পেজে ফিরে যান
          </Link>
        </div>
      </main>
    );
  }

  if (products.length === 0) {
    return (
      <main className="category-page">
        <div className="category-container empty-state">
          <div className="empty-icon">{category.icon || "🛒"}</div>
          <h1>এই ক্যাটাগরিতে কোনো পণ্য নেই</h1>
          <p>অন্য পণ্য দেখতে হোম পেজে ফিরে যাও।</p>
          <Link href="/" className="home-button">
            হোম পেজে ফিরে যান
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="category-page">
      <div className="category-container">
        {/* Category heading */}
        <header className="category-heading">
          <span className="category-icon">{category.icon || "🛒"}</span>

          <div>
            <h1>{category.nameBn}</h1>
            <p>প্রতিদিনের বাজারের পণ্যের দাম ও পরিবর্তন</p>
          </div>
        </header>

        {/* Sorting */}
        <div className="category-toolbar">
          <span>সাজান</span>

          <div className="sort-wrapper">
            <select
              aria-label="পণ্য সাজান"
              value={sort}
              onChange={(event) => setSort(event.target.value as SortOption)}
            >
              <option value="default">ডিফল্ট</option>
              <option value="asc">দাম: কম থেকে বেশি</option>
              <option value="desc">দাম: বেশি থেকে কম</option>
            </select>
          </div>
        </div>

        <p className="product-count">
          মোট {formatNumber(sortedProducts.length)}
          টি পণ্য দেখানো হচ্ছে
        </p>

        {/* Product cards */}
        <div className="product-grid">
          {sortedProducts.map((product) => {
            const change = getChange(product);

            return (
              <Link
                href={`/product/${product.slug || product.id}`}
                className="product-card"
                key={product.id}
              >
                <div className="product-title-row">
                  <span className="product-icon">
                    {product.categoryIcon || category.icon || "🛒"}
                  </span>

                  <div>
                    <h2>{product.nameBn}</h2>
                    <p>{product.unit || "প্রতি একক"}</p>
                  </div>
                </div>

                <div className="price-row">
                  <div>
                    <span className="price-label">আজকের দাম</span>

                    <p className="product-price">
                      {formatNumber(product.today)} টাকা
                    </p>
                  </div>

                  <span className={`change-badge ${change.type}`}>
                    {change.text}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}

// Suspense fallback এবং মূল page।
export default function CategoryPage() {
  return (
    <Suspense
      fallback={
        <main className="category-page">
          <div className="category-container">
            <div className="skeleton category-heading-skeleton" />
            <div className="skeleton category-toolbar-skeleton" />
            <p className="loading-text">ক্যাটাগরির তথ্য লোড হচ্ছে...</p>
          </div>
        </main>
      }
    >
      <CategoryPageContent />
    </Suspense>
  );
}
