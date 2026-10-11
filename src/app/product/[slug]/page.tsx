import { notFound } from "next/navigation";
import Image from "next/image";

const API_URL = "https://openapi.programming-hero.com/api/bazardor";

type Market = {
  market: string;
  division: string;
  min: number;
  max: number;
};

type Product = {
  id: number | string;
  slug: string;
  nameBn: string;
  category: string;
  categoryNameBn: string;
  categoryIcon: string;
  unit: string;
  image: string;
  today: number;
  yesterday: number;
  lastWeek: number;
  lastMonth: number;
  change: {
    dir: string;
    pct: number;
  };
  markets: Market[];
};

type ProductSummary = {
  id: number | string;
  slug: string;
};

function getList(data: unknown): ProductSummary[] {
  if (Array.isArray(data)) {
    return data as ProductSummary[];
  }

  if (data && typeof data === "object") {
    const body = data as Record<string, unknown>;

    if (Array.isArray(body.data)) {
      return body.data as ProductSummary[];
    }

    if (Array.isArray(body.products)) {
      return body.products as ProductSummary[];
    }
  }

  return [];
}

async function getProduct(slug: string): Promise<Product | null> {
  const listResponse = await fetch(`${API_URL}/products`, {
    cache: "no-store",
  });

  if (!listResponse.ok) {
    throw new Error("Products API request failed");
  }

  const listData: unknown = await listResponse.json();
  const products = getList(listData);

  const selected = products.find((item) => item.slug === slug);

  if (!selected) return null;

  const detailResponse = await fetch(`${API_URL}/products/${selected.id}`, {
    cache: "no-store",
  });

  if (!detailResponse.ok) {
    throw new Error("Product details API request failed");
  }

  const result: unknown = await detailResponse.json();

  if (!result || typeof result !== "object") {
    return null;
  }

  const body = result as Record<string, unknown>;

  const rawProduct =
    body.data && typeof body.data === "object" ? body.data : result;

  const product = rawProduct as Product;

  if (product.id == null || !product.nameBn) {
    return null;
  }

  return product;
}

function money(value: number) {
  return new Intl.NumberFormat("bn-BD", {
    maximumFractionDigits: 2,
  }).format(value);
}

function getUnit(unit: string) {
  const units: Record<string, string> = {
    kg: "প্রতি কেজি",
    liter: "প্রতি লিটার",
    litre: "প্রতি লিটার",
    dozen: "প্রতি ডজন",
    piece: "প্রতি পিস",
    pcs: "প্রতি পিস",
  };

  return units[unit?.toLowerCase()] ?? `প্রতি ${unit || "একক"}`;
}

function PriceCard({
  title,
  price,
  description,
  color = "normal",
}: {
  title: string;
  price: number;
  description: string;
  color?: "normal" | "green" | "red";
}) {
  const styles = {
    normal: "border-gray-200 bg-white text-[#253027]",
    green: "border-green-200 bg-green-50 text-green-800",
    red: "border-red-200 bg-red-50 text-red-800",
  };

  return (
    <div className={`rounded-2xl border p-5 shadow-sm ${styles[color]}`}>
      <p className="text-sm font-medium opacity-80">{title}</p>

      <p className="mt-3 text-2xl font-extrabold sm:text-3xl">
        {money(price)} টাকা
      </p>

      <p className="mt-2 text-xs opacity-75">{description}</p>
    </div>
  );
}

export default async function ProductDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let product: Product | null;

  try {
    product = await getProduct(slug);
  } catch {
    throw new Error("পণ্যের তথ্য লোড করা যায়নি। পরে আবার চেষ্টা করো।");
  }

  if (!product) notFound();

  const markets = Array.isArray(product.markets)
    ? product.markets.filter(
        (market) =>
          Number.isFinite(Number(market.min)) &&
          Number.isFinite(Number(market.max)),
      )
    : [];

  const minimumPrice =
    markets.length > 0
      ? Math.min(...markets.map((market) => Number(market.min)))
      : Number(product.today) || 0;

  const maximumPrice =
    markets.length > 0
      ? Math.max(...markets.map((market) => Number(market.max)))
      : Number(product.today) || 0;

  // Calculate the average of all market minimum and maximum prices.
  const allPrices = markets.flatMap((market) => [
    Number(market.min),
    Number(market.max),
  ]);

  const averagePrice =
    allPrices.length > 0
      ? allPrices.reduce((total, price) => total + price, 0) / allPrices.length
      : Number(product.today) || 0;

  const direction = product.change?.dir?.toLowerCase();
  const priceIncreased = direction === "up" || direction === "▲";

  const priceDecreased = direction === "down" || direction === "▼";

  const changeColor = priceIncreased
    ? "bg-red-50 text-red-600"
    : priceDecreased
      ? "bg-green-50 text-green-700"
      : "bg-gray-100 text-gray-600";

  return (
    <main className="min-h-screen bg-[#f0f5f0] px-3 py-6 sm:px-5 sm:py-8">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Product information */}
        <section className="rounded-2xl border border-[#e3eae3] bg-white p-5 shadow-sm sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
            <div className="relative flex h-32 w-32 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-gray-100 bg-[#f5f8f5] p-3 sm:h-40 sm:w-40">
              {product.image && /^https?:\/\//.test(product.image) ? (
                <Image
                  src={product.image}
                  alt={product.nameBn}
                  fill
                  unoptimized
                  sizes="160px"
                  className="object-contain p-3"
                />
              ) : (
                <span
                  className="text-5xl"
                  role="img"
                  aria-label={product.nameBn}
                >
                  {product.image || product.categoryIcon || "🛒"}
                </span>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <div className="mb-3 flex flex-wrap gap-2">
                <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-800">
                  {product.categoryIcon} {product.categoryNameBn}
                </span>

                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600">
                  {getUnit(product.unit)}
                </span>
              </div>

              <h1 className="text-2xl font-extrabold text-[#253027] sm:text-3xl">
                {product.nameBn}
              </h1>

              <p className="mt-2 text-sm leading-6 text-gray-600">
                বিভিন্ন বাজারের আজকের দাম, গড় দাম এবং আগের সময়ের দামের তুলনা এক
                জায়গায় দেখুন।
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-3">
                <span className="text-sm text-gray-500">আজকের দাম</span>

                <span className="text-2xl font-extrabold text-green-700">
                  {money(Number(product.today) || 0)} টাকা
                </span>

                {product.change && (
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold ${changeColor}`}
                  >
                    {priceIncreased ? "▲" : priceDecreased ? "▼" : "—"}{" "}
                    {money(Math.abs(Number(product.change.pct) || 0))}%
                  </span>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Price summary */}
        <section>
          <h2 className="mb-4 text-xl font-extrabold text-[#253027]">
            দামের সারসংক্ষেপ
          </h2>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <PriceCard
              title="সর্বনিম্ন দাম"
              price={minimumPrice}
              description="↓ বাজারের সবচেয়ে কম দাম"
              color="green"
            />

            <PriceCard
              title="সর্বোচ্চ দাম"
              price={maximumPrice}
              description="↑ বাজারের সবচেয়ে বেশি দাম"
              color="red"
            />

            <PriceCard
              title="গড় দাম"
              price={averagePrice}
              description="◎ সব বাজারের দামের গড়"
              color="green"
            />
          </div>

          <p className="mt-3 text-xs leading-5 text-gray-500">
            গড় দাম = প্রতিটি বাজারের সর্বনিম্ন ও সর্বোচ্চ দাম যোগ করে মোট দামের
            সংখ্যা দিয়ে ভাগ।
          </p>
        </section>

        {/* Previous prices */}
        <section className="rounded-2xl border border-[#e3eae3] bg-white p-5 shadow-sm sm:p-6">
          <h2 className="mb-4 text-lg font-extrabold text-[#253027]">
            আগের সময়ের দাম
          </h2>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: "আজ", price: product.today },
              { label: "গতকাল", price: product.yesterday },
              { label: "গত সপ্তাহ", price: product.lastWeek },
              { label: "গত মাস", price: product.lastMonth },
            ].map((item) => (
              <div key={item.label} className="rounded-xl bg-[#f5f8f5] p-4">
                <p className="text-xs text-gray-500">{item.label}</p>

                <p className="mt-2 font-bold text-gray-900">
                  {money(Number(item.price) || 0)} টাকা
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Market prices */}
        <section className="overflow-hidden rounded-2xl border border-[#e3eae3] bg-white shadow-sm">
          <div className="border-b border-gray-100 p-5 sm:p-6">
            <h2 className="text-lg font-extrabold text-[#253027]">
              বাজারভিত্তিক আজকের দাম
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {product.nameBn} — {markets.length}টি বাজারের তথ্য
            </p>
          </div>

          {markets.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[750px] text-left text-sm">
                <thead className="bg-[#f5f8f5] text-gray-600">
                  <tr>
                    <th className="px-5 py-4 font-semibold">বাজারের নাম</th>
                    <th className="px-5 py-4 font-semibold">বিভাগ</th>
                    <th className="px-5 py-4 font-semibold">সর্বনিম্ন</th>
                    <th className="px-5 py-4 font-semibold">সর্বোচ্চ</th>
                    <th className="px-5 py-4 font-semibold">গড় দাম</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {markets.map((market, index) => {
                    const average =
                      (Number(market.min) + Number(market.max)) / 2;

                    return (
                      <tr
                        key={`${market.market}-${index}`}
                        className="transition hover:bg-green-50/50"
                      >
                        <td className="px-5 py-4 font-medium text-gray-800">
                          {market.market}
                        </td>

                        <td className="px-5 py-4 text-gray-600">
                          {market.division}
                        </td>

                        <td className="px-5 py-4 font-semibold text-green-700">
                          {money(Number(market.min))} টাকা
                        </td>

                        <td className="px-5 py-4 font-semibold text-gray-800">
                          {money(Number(market.max))} টাকা
                        </td>

                        <td className="px-5 py-4 font-extrabold text-green-800">
                          {money(average)} টাকা
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="p-6 text-sm text-gray-500">
              বাজারভিত্তিক তথ্য এখন পাওয়া যাচ্ছে না।
            </p>
          )}
        </section>

        <p className="pb-4 text-xs leading-5 text-gray-500">
          প্রদর্শিত দাম API থেকে পাওয়া তথ্যের ভিত্তিতে দেখানো হচ্ছে। বাজারভেদে
          দাম আলাদা হতে পারে।
        </p>
      </div>
    </main>
  );
}
