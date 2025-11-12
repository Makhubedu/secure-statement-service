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
      <div className="card-capitec max-w-2xl w-full p-4 md:p-8">
        <div className="flex items-center justify-between mb-4 md:mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-capitec-navy">Secure Download Link</h2>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-capitec-navy transition-colors text-3xl leading-none p-1"
            aria-label="Close modal"
          >
            ×
          </button>
        </div>

        {error ? (
          <div className="alert-capitec-error">{error}</div>
        ) : url ? (
          <div className="space-y-4">
            {fileName && (
              <div className="text-sm text-neutral-500">
                <span className="font-semibold">File:</span> <span className="break-all">{fileName}</span>
              </div>
            )}
            {expiresAt && (
              <div className="text-sm text-neutral-500">
                <span className="font-semibold">Expires:</span> {new Date(expiresAt).toLocaleString()}
              </div>
            )}
            <div className="input-capitec break-all select-all text-sm">{url}</div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleCopyLink}
                className="flex-1 btn-capitec-outline"
              >
                Copy Link
              </button>
              <a href={url} target="_blank" rel="noreferrer" className="flex-1 btn-capitec-primary text-center">
                Open Link
              </a>
            </div>
          </div>
        ) : (
          <div className="text-neutral-400 text-center py-8">Generating link…</div>
        )}
      </div>
    </div>
  );
}
