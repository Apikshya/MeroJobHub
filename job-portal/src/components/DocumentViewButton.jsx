import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import {
  getDocumentBase64,
  base64ToBlob,
  guessMimeType,
  canPreviewInline,
  triggerBlobDownload,
} from '../api/documentsApi';

// fileName = the stored file_name (uuid-prefixed); downloadName = the friendly name to save/display as
export default function DocumentViewButton({ fileName, downloadName, className = '' }) {
  const [loadingAction, setLoadingAction] = useState(null); // 'view' | 'download' | null
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [previewMime, setPreviewMime] = useState(null);

  // Clean up the object URL when the preview closes or the component unmounts
  useEffect(() => {
    return () => {
      if (previewUrl) window.URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const fetchBlob = async () => {
    const res = await getDocumentBase64(fileName);
    const doc = res.data?.data;
    if (!doc?.base64) throw new Error('No file data returned');
    const mimeType = guessMimeType(downloadName || doc.file_name || fileName);
    const blob = base64ToBlob(doc.base64, mimeType);
    return { blob, mimeType };
  };

  const handleView = async () => {
    setLoadingAction('view');
    try {
      const { blob, mimeType } = await fetchBlob();
      const url = window.URL.createObjectURL(blob);
      setPreviewUrl(url);
      setPreviewMime(mimeType);
      setPreviewOpen(true);
    } catch (err) {
      console.error('Document view failed:', err);
      toast.error(err?.response?.data?.message || 'Could not open document');
    } finally {
      setLoadingAction(null);
    }
  };

  const handleDownload = async () => {
    setLoadingAction('download');
    try {
      const { blob } = await fetchBlob();
      triggerBlobDownload(blob, downloadName || fileName);
    } catch (err) {
      console.error('Document download failed:', err);
      toast.error(err?.response?.data?.message || 'Could not download document');
    } finally {
      setLoadingAction(null);
    }
  };

  const closePreview = () => {
    setPreviewOpen(false);
    if (previewUrl) window.URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
  };

  return (
    <>
      {/* Action buttons - redesigned as modern pills */}
      <span className={className || 'inline-flex items-center gap-2'}>
        <button
          onClick={handleView}
          disabled={loadingAction !== null}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-full transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loadingAction === 'view' ? (
            <>
              <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Opening...
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              View
            </>
          )}
        </button>

        <button
          onClick={handleDownload}
          disabled={loadingAction !== null}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loadingAction === 'download' ? (
            <>
              <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Downloading...
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download
            </>
          )}
        </button>
      </span>

      {/* Modern preview modal */}
      {previewOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[60]">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-fade-in-up">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-gray-50/80 border-b border-gray-200">
              <div className="flex items-center gap-3 min-w-0">
                <svg className="w-5 h-5 text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="font-semibold text-gray-800 truncate">{downloadName || fileName}</p>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <button
                  onClick={handleDownload}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-full transition"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download
                </button>
                <button
                  onClick={closePreview}
                  className="text-gray-400 hover:text-gray-600 text-2xl leading-none px-1 transition"
                >
                  ×
                </button>
              </div>
            </div>

            {/* Preview area */}
            <div className="flex-1 overflow-auto bg-gray-50 flex items-center justify-center p-4">
              {canPreviewInline(previewMime) ? (
                previewMime === 'application/pdf' ? (
                  <iframe
                    src={previewUrl}
                    title={downloadName || fileName}
                    className="w-full h-[75vh] rounded-lg bg-white shadow-inner"
                  />
                ) : (
                  <img
                    src={previewUrl}
                    alt={downloadName || fileName}
                    className="max-w-full max-h-[75vh] object-contain rounded-lg shadow-inner"
                  />
                )
              ) : (
                <div className="text-center py-16 px-4">
                  <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </div>
                  <p className="text-gray-500 text-sm mb-3">
                    Preview isn't available for this file type. Download it to view the contents.
                  </p>
                  <button
                    onClick={handleDownload}
                    className="inline-flex items-center gap-1.5 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-full shadow-sm transition"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download File
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Animation keyframes (if not globally defined) */}
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: scale(0.96) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.2s ease-out;
        }
      `}</style>
    </>
  );
}