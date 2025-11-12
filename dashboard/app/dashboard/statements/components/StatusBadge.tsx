type StatusBadgeProps = {
  isExpired?: boolean;
  isDownloadable?: boolean;
  status: string;
};

export function StatusBadge({ isExpired, isDownloadable, status }: StatusBadgeProps) {
  if (isExpired) {
    return (
      <span className="px-2 py-1 text-xs font-semibold rounded bg-red-100 text-capitec-red">
        Expired
      </span>
    );
  }

  if (isDownloadable) {
    return (
      <span className="px-2 py-1 text-xs font-semibold rounded bg-green-100 text-capitec-green">
        Available
      </span>
    );
  }

  return (
    <span className="px-2 py-1 text-xs font-semibold rounded bg-yellow-100 text-yellow-700">
      {status}
    </span>
  );
}
