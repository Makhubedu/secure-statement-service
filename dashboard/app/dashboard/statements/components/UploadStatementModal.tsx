import { useState } from "react";

type UploadStatementModalProps = {
  isOpen: boolean;
  userEmail?: string;
  onClose: () => void;
  onUploadSuccess: () => void;
  apiBase: string;
  userId?: string;
};

export function UploadStatementModal({
  isOpen,
  userEmail,
  onClose,
  onUploadSuccess,
  apiBase,
  userId,
}: UploadStatementModalProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState("");
  const [formData, setFormData] = useState({
    statementPeriod: "",
    statementDate: "",
    file: null as File | null,
  });

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== "application/pdf") {
        setUploadError("Please select a PDF file");
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setUploadError("File size must be less than 10MB");
        return;
      }
      setFormData((prev) => ({ ...prev, file }));
      setUploadError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploadError("");
    setUploadSuccess("");
    setIsUploading(true);

    if (!formData.file) {
      setUploadError("Please select a file");
      setIsUploading(false);
      return;
    }

    if (!userId) {
      setUploadError("User not authenticated");
      setIsUploading(false);
      return;
    }

    try {
      const data = new FormData();
      data.append("file", formData.file);
      data.append("userId", userId);
      data.append("statementPeriod", formData.statementPeriod);
      data.append("statementDate", new Date(formData.statementDate).toISOString());

      const response = await fetch(`${apiBase}/statements/upload`, {
        method: "POST",
        body: data,
        credentials: "include",
      });

      const result = await response.json();

      if (!response.ok) {
        setUploadError(result.message || "Upload failed");
        setIsUploading(false);
        return;
      }

      setUploadSuccess("Statement uploaded successfully!");
      setFormData({ statementPeriod: "", statementDate: "", file: null });

      const fileInput = document.getElementById("file-input") as HTMLInputElement;
      if (fileInput) fileInput.value = "";

      onUploadSuccess();

      setTimeout(() => {
        onClose();
        setUploadSuccess("");
      }, 1500);
    } catch (error) {
      console.error("Upload error:", error);
      setUploadError("An error occurred during upload");
    } finally {
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    onClose();
    setUploadError("");
    setUploadSuccess("");
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="card-capitec max-w-2xl w-full p-8 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-capitec-navy">Upload Statement</h2>
          <button
            onClick={handleClose}
            className="text-neutral-400 hover:text-capitec-navy transition-colors text-3xl leading-none"
          >
            ×
          </button>
        </div>

        {uploadError && <div className="alert-capitec-error mb-4">{uploadError}</div>}
        {uploadSuccess && (
          <div
            className="rounded-lg border-2 p-4 text-sm font-medium mb-4"
            style={{
              borderColor: "var(--capitec-green)",
              backgroundColor: "#E7F7EF",
              color: "var(--capitec-green)",
            }}
          >
            {uploadSuccess}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="label-capitec">Uploading For</label>
            <div className="input-capitec bg-neutral-50 cursor-not-allowed">
              {userEmail || "Loading..."}
            </div>
            <p className="text-xs text-neutral-400 mt-1">
              Statement will be assigned to this user
            </p>
          </div>

          <div>
            <label htmlFor="statementPeriod" className="label-capitec">
              Statement Period <span className="text-capitec-red">*</span>
            </label>
            <input
              id="statementPeriod"
              type="text"
              value={formData.statementPeriod}
              onChange={(e) =>
                setFormData({ ...formData, statementPeriod: e.target.value })
              }
              placeholder="YYYY-MM (e.g., 2024-03)"
              pattern="\d{4}-(0[1-9]|1[0-2])"
              required
              className="input-capitec"
            />
            <p className="text-xs text-neutral-400 mt-1">Format: YYYY-MM</p>
          </div>

          <div>
            <label htmlFor="statementDate" className="label-capitec">
              Statement Date <span className="text-capitec-red">*</span>
            </label>
            <input
              id="statementDate"
              type="date"
              value={formData.statementDate}
              onChange={(e) =>
                setFormData({ ...formData, statementDate: e.target.value })
              }
              required
              className="input-capitec"
            />
          </div>

          <div>
            <label htmlFor="file-input" className="label-capitec">
              PDF File <span className="text-capitec-red">*</span>
            </label>
            <div
              className="border-2 border-dashed rounded-lg p-6 text-center transition-colors"
              style={{
                borderColor: formData.file
                  ? "var(--capitec-blue)"
                  : "var(--neutral-100)",
              }}
            >
              <input
                id="file-input"
                type="file"
                accept=".pdf,application/pdf"
                onChange={handleFileChange}
                required
                className="hidden"
              />
              <label htmlFor="file-input" className="cursor-pointer">
                <svg
                  className="mx-auto h-12 w-12 text-neutral-400 mb-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
                {formData.file ? (
                  <p className="text-sm font-medium text-capitec-navy">
                    {formData.file.name}
                  </p>
                ) : (
                  <p className="text-sm text-neutral-400">
                    Click to select PDF file or drag and drop
                  </p>
                )}
                <p className="text-xs text-neutral-400 mt-1">PDF only, max 10MB</p>
              </label>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-6 py-3 rounded-lg font-bold transition-all border-2"
              style={{
                borderColor: "var(--neutral-100)",
                color: "var(--neutral-400)",
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUploading}
              className="flex-1 btn-capitec-primary"
            >
              {isUploading ? "Uploading..." : "Upload Statement"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
