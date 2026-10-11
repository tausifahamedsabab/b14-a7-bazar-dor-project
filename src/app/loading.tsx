import ProductSkeleton from "./ProductSkeleton";

export default function Loading() {
  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-8 animate-pulse space-y-3">
        <div className="h-8 w-2/3 rounded-lg bg-gray-200 sm:w-1/3" />
        <div className="h-4 w-full max-w-md rounded bg-gray-200" />
      </div>

      <ProductSkeleton count={8} />
    </main>
  );
}
