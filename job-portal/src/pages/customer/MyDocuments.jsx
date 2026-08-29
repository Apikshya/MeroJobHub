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
import {
  FileText,
  CheckCircle,
  UploadCloud,
  Loader2,
  FileEdit,
  Image,
  Paperclip,
  FolderKanban,
  FileCheck,
} from 'lucide-react';

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
      toast.success('Document uploaded successfully');
      setFile(null);
      const input = document.getElementById('doc-upload-input');
      if (input) input.value = '';
      loadDocuments();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

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

  const getFileIcon = (fileType) => {
    const type = fileType?.toLowerCase();
    if (type === 'pdf') return <FileText className="w-5 h-5 text-red-500" />;
    if (type === 'doc' || type === 'docx') return <FileEdit className="w-5 h-5 text-blue-500" />;
    if (type === 'png' || type === 'jpg' || type === 'jpeg')
      return <Image className="w-5 h-5 text-purple-500" />;
    return <Paperclip className="w-5 h-5 text-slate-500" />;
  };

  return (
    <div className="space-y-6">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">My Documents</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Upload your resumes, certificates, and credentials to attach with your job applications.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upload Card - Left Column */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
            <UploadCloud className="w-5 h-5 text-[#2563eb]" />
            Upload New Document
          </h2>

          <form onSubmit={handleUpload} className="space-y-4">
            {/* Drop Zone */}
            <label
              htmlFor="doc-upload-input"
              className={`relative block w-full border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
                file
                  ? 'border-emerald-400 bg-emerald-50/50'
                  : 'border-slate-200 bg-slate-50/50 hover:border-[#2563eb] hover:bg-[#eff6ff]/30'
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
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-2">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <p className="font-semibold text-slate-900 text-sm truncate max-w-[200px]">
                    {file.name}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {(file.size / 1024).toFixed(1)} KB
                  </p>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      handleRemoveFile();
                    }}
                    className="mt-2 text-xs font-semibold text-red-500 hover:text-red-700"
                  >
                    Change file
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-[#eff6ff] text-[#2563eb] flex items-center justify-center mb-2">
                    <UploadCloud className="w-6 h-6" />
                  </div>
                  <p className="font-semibold text-slate-800 text-sm">
                    Click to browse document
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    PDF, DOC, DOCX, PNG, JPG (up to 10MB)
                  </p>
                </div>
              )}
            </label>

            {/* Document Type Dropdown */}
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1">
                Document Type
              </label>
              <select
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-slate-700"
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

            {/* Submit Button */}
            <button
              type="submit"
              disabled={uploading || !file}
              className="w-full bg-[#2563eb] hover:bg-[#1d4ed8] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-xl shadow-sm transition flex items-center justify-center gap-2 text-sm"
            >
              {uploading ? (
                <>
                  <Loader2 className="animate-spin h-4 w-4 text-white" />
                  Uploading...
                </>
              ) : (
                <>
                  <FileCheck className="w-4 h-4" />
                  Upload Document
                </>
              )}
            </button>
          </form>
        </div>

        {/* Document List - Right Columns (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <FolderKanban className="w-5 h-5 text-[#2563eb]" />
              Uploaded Documents
            </h2>
            <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
              {documents.length} files
            </span>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-slate-50 rounded-xl p-4 animate-pulse border border-slate-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-slate-200 rounded-lg"></div>
                      <div>
                        <div className="h-4 bg-slate-200 rounded w-32"></div>
                        <div className="h-3 bg-slate-200 rounded w-20 mt-1"></div>
                      </div>
                    </div>
                    <div className="h-8 bg-slate-200 rounded w-20"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : documents.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-slate-200 rounded-2xl text-slate-400">
              <FileText className="w-10 h-10 mx-auto text-slate-300 mb-2" />
              <p className="text-sm font-semibold text-slate-700">No documents uploaded yet</p>
              <p className="text-xs text-slate-400 mt-1">
                Upload your resume or certificates using the form on the left.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className="bg-white rounded-xl p-4 border border-slate-100 hover:border-slate-200 hover:shadow-sm transition-all flex flex-wrap items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center flex-shrink-0">
                      {getFileIcon(doc.file_type)}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-800 text-sm truncate">
                        {doc.original_file_name}
                      </p>
                      <div className="flex flex-wrap items-center gap-x-2.5 text-xs text-slate-400 mt-0.5">
                        <span className="uppercase font-medium text-slate-500">{doc.file_type}</span>
                        <span>·</span>
                        <span>{doc.size_readable}</span>
                        <span>·</span>
                        <span className="inline-flex items-center text-xs bg-[#eff6ff] text-[#2563eb] px-2 py-0.5 rounded-full border border-[#bfdbfe]">
                          {doc.association_type?.replace(/_/g, ' ') || 'Document'}
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
  );
}