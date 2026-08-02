export function AvailabilityBadge({ isAvailable }: { isAvailable: boolean }) {
  if (isAvailable) return null;
  return (
    <span className="px-2 py-1 text-xs font-semibold text-red-700 bg-red-100 rounded-full">
      Out of Stock
    </span>
  );
}
