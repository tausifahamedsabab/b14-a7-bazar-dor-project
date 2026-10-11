export default function ProductSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div
      className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4"
      aria-label="পণ্য লোড হচ্ছে"
      aria-busy="true"
    >
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="animate-pulse overflow-hidden rounded-2xl border border-gray-200 bg-white"
        >
          <div className="aspect-square bg-gray-200" />

          <div className="space-y-3 p-3 sm:p-4">
            <div className="h-3 w-1/3 rounded bg-gray-200" />
            <div className="h-4 w-4/5 rounded bg-gray-200" />
            <div className="h-4 w-1/2 rounded bg-gray-200" />
            <div className="h-9 w-full rounded-lg bg-gray-200" />
          </div>
        </div>
      ))}
    </div>
  );
}
