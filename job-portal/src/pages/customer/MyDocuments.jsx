import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import {
  ASSOCIATION_TYPES,
  getDocumentsByEmail,
  uploadDocument,
  fileToBase64,
  getFileExtension,
} from '../../api/documentsApi';
import DocumentViewButton from '../../components/DocumentViewButton';
import { useAuth } from '../../context/AuthContext';

export default function MyDocuments() {
  const { user } = useAuth();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState(null);
  const [associationType, setAssociationType] = useState('RESUME');
  const [uploading, setUploading] = useState(false);

  const loadDocuments = () => {
    if (!user?.email) return;
    setLoading(true);
    getDocumentsByEmail(user.email)
      .then((res) => setDocuments(res.data?.data?.documents || []))
      .catch(() => toast.error('Could not load documents'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadDocuments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.email]);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      toast.error('Please choose a file first');
      return;
    }
    setUploading(true);
    try {
      const base64Data = await fileToBase64(file);
      await uploadDocument({
        fileName: file.name,
        fileType: getFileExtension(file.name),
        associationTo: 'CUSTOMER',
        associationId: String(user.id),
        associationType,
        base64Data,
      });
      toast.success('Document uploaded');
      setFile(null);
      loadDocuments();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  // Reset file input
  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    const input = document.getElementById('doc-upload-input');
    if (input) input.value = '';
  };

  // Helper to get file icon
  const getFileIcon = (fileType) => {
    const type = fileType?.toLowerCase();
    if (type === 'pdf') return '📄';
    if (type === 'doc' || type === 'docx') return '📝';
    if (type === 'png' || type === 'jpg' || type === 'jpeg') return '🖼️';
    return '📎';
  };

  return (
    <div className="">
      {/* Main card */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
        {/* Gradient header */}
        <div className="h-28 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 flex items-center justify-center">
          <div className="bg-white/20 backdrop-blur-sm p-3 rounded-full">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 pb-6 pt-4 bg-gray-50/50">
          <h1 className="text-2xl font-bold text-gray-800">My Documents</h1>
          <p className="text-sm text-gray-500 mt-1">Upload and manage your documents</p>

          {/* Upload form */}
          <form onSubmit={handleUpload} className="mt-6">
            {/* Drop zone */}
            <label
              htmlFor="doc-upload-input"
              className={`relative block w-full border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
                file
                  ? 'border-green-400 bg-green-50 hover:bg-green-100'
                  : 'border-gray-300 bg-white hover:border-blue-400 hover:bg-blue-50'
              }`}
            >
              <input
                id="doc-upload-input"
                type="file"
                className="hidden"
                onChange={handleFileChange}
              />
              {file ? (
                <div className="flex flex-col items-center">
                  <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="mt-2 font-medium text-gray-800">{file.name}</p>
                  <p className="text-xs text-gray-500">
                    {(file.size / 1024).toFixed(1)} KB
                  </p>
                  <button
                    type="button"
                    onClick={handleRemoveFile}
                    className="mt-2 text-sm text-red-500 hover:text-red-700 font-medium"
                  >
                    Remove file
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p className="mt-2 font-semibold text-gray-700">
                    Click to select a document
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Resume, cover letter, certificates, IDs, etc.
                  </p>
                </div>
              )}
            </label>

            {/* Document type dropdown */}
            <div className="mt-4">
              <label className="text-sm font-medium text-gray-700">Document type</label>
              <select
                className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                value={associationType}
                onChange={(e) => setAssociationType(e.target.value)}
              >
                {ASSOCIATION_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type.replace(/_/g, ' ')}
                  </option>
                ))}
              </select>
            </div>

            {/* Upload button */}
            <button
              type="submit"
              disabled={uploading || !file}
              className="mt-5 w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-2.5 rounded-full shadow-sm transition"
            >
              {uploading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Uploading...
                </span>
              ) : (
                'Upload Document'
              )}
            </button>
          </form>

          {/* Document list */}
          <div className="mt-8">
            <h2 className="font-semibold text-gray-800 mb-3">Uploaded Documents</h2>
            {loading ? (
              <div className="space-y-3">
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="bg-white rounded-xl shadow-sm p-4 animate-pulse">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                        <div>
                          <div className="h-4 bg-gray-200 rounded w-32"></div>
                          <div className="h-3 bg-gray-200 rounded w-20 mt-1"></div>
                        </div>
                      </div>
                      <div className="h-8 bg-gray-200 rounded w-20"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : documents.length === 0 ? (
              <div className="text-center py-6 bg-white rounded-xl border border-gray-100">
                <p className="text-gray-500">No documents uploaded yet.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 p-4 border border-gray-100 flex flex-wrap items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <span className="text-2xl">{getFileIcon(doc.file_type)}</span>
                      <div className="min-w-0">
                        <p className="font-medium text-gray-800 truncate">{doc.original_file_name}</p>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500">
                          <span className="uppercase">{doc.file_type}</span>
                          <span>•</span>
                          <span>{doc.size_readable}</span>
                          <span>•</span>
                          <span className="capitalize">
                            {doc.association_type?.replace(/_/g, ' ') || 'Unknown'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <DocumentViewButton fileName={doc.file_name} downloadName={doc.original_file_name} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}