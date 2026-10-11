"use client";

import { useEffect, useState } from "react";
import type { Product } from "./navbar-types";

const API_URL = "https://openapi.programming-hero.com/api/bazardor";

export default function PriceTicker() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function loadProducts() {
      try {
        const response = await fetch(`${API_URL}/products`);
        if (!response.ok) throw new Error("Product fetch failed");

        const result: unknown = await response.json();
        let list: Product[] = [];

        if (Array.isArray(result)) {
          list = result as Product[];
        } else if (result && typeof result === "object") {
          const data = result as Record<string, unknown>;
          if (Array.isArray(data.data)) list = data.data as Product[];
          else if (Array.isArray(data.products))
            list = data.products as Product[];
        }

        setProducts(list);
      } catch (error) {
        console.error("Product API error:", error);
      }
    }

    loadProducts();
  }, []);

  if (products.length === 0) return null;

  return (
    <div className="w-full overflow-hidden border-t border-[#e8eee8] bg-white">
      <div className="flex w-max animate-[ticker_35s_linear_infinite] items-center hover:[animation-play-state:paused]">
        {[...products, ...products].map((product, index) => {
          const down =
            product.change?.dir === "down" || product.change?.dir === "▼";

          return (
            <div
              key={`${product.id}-${index}`}
              className="flex shrink-0 items-center gap-1.5 border-r border-gray-100 px-5 py-2 text-xs"
            >
              <span>{product.categoryIcon || "🛒"}</span>
              <span className="font-medium text-gray-700">
                {product.nameBn}
              </span>
              <span className="text-gray-500">
                {product.today ?? "—"} টাকা
                {product.unit ? `/${product.unit}` : ""}
              </span>

              {product.change && (
                <span
                  className={
                    down
                      ? "font-semibold text-green-600"
                      : "font-semibold text-red-600"
                  }
                >
                  {down ? "▼" : "▲"} {product.change.pct}%
                </span>
              )}
            </div>
          );
        })}
      </div>

      <style jsx>{`
        @keyframes ticker {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
}
