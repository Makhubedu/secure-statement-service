type DownloadLinkModalProps = {
  isOpen: boolean;
  url: string;
  fileName?: string;
  expiresAt?: string;
  error?: string;
  onClose: () => void;
};

export function DownloadLinkModal({
  isOpen,
  url,
  fileName,
  expiresAt,
  error,
  onClose,
}: DownloadLinkModalProps) {
  if (!isOpen) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(url);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="card-capitec max-w-2xl w-full p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-capitec-navy">Secure download link</h2>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-capitec-navy transition-colors text-3xl leading-none"
          >
            ×
          </button>
        </div>

        {error ? (
          <div className="alert-capitec-error">{error}</div>
        ) : url ? (
          <div className="space-y-4">
            {fileName && <div className="text-sm text-neutral-500">File: {fileName}</div>}
            {expiresAt && (
              <div className="text-sm text-neutral-500">
                Expires at: {new Date(expiresAt).toLocaleString()}
              </div>
            )}
            <div className="input-capitec break-all select-all">{url}</div>
            <div className="flex gap-3">
              <button
                onClick={handleCopyLink}
                className="px-4 py-2 rounded-lg font-semibold transition-all border-2"
                style={{
                  borderColor: "var(--capitec-blue)",
                  color: "var(--capitec-blue)",
                  backgroundColor: "transparent",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "var(--capitec-blue)";
                  e.currentTarget.style.color = "white";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.color = "var(--capitec-blue)";
                }}
              >
                Copy link
              </button>
              <a href={url} target="_blank" rel="noreferrer" className="btn-capitec-primary">
                Open link
              </a>
            </div>
          </div>
        ) : (
          <div className="text-neutral-400">Generating link…</div>
        )}
      </div>
    </div>
  );
}
