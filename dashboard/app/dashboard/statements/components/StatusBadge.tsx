type StatusBadgeProps = {
  isExpired?: boolean;
  isDownloadable?: boolean;
  status: string;
};

export function StatusBadge({ isExpired, isDownloadable, status }: StatusBadgeProps) {
  if (isExpired) {
    return (
      <span
        className="px-2 py-1 text-xs font-semibold rounded"
        style={{ backgroundColor: "#FFE5E5", color: "var(--capitec-red)" }}
      >
        Expired
      </span>
    );
  }

  if (isDownloadable) {
    return (
      <span
        className="px-2 py-1 text-xs font-semibold rounded"
        style={{ backgroundColor: "#E7F7EF", color: "var(--capitec-green)" }}
      >
        Available
      </span>
    );
  }

  return (
    <span
      className="px-2 py-1 text-xs font-semibold rounded"
      style={{ backgroundColor: "#FFF4E5", color: "#FF9500" }}
    >
      {status}
    </span>
  );
}
