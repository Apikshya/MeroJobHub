import { useState } from 'react';
import toast from 'react-hot-toast';
import { uploadCv } from '../../api/profileApi';
import { FileText, CheckCircle, UploadCloud, Loader2 } from 'lucide-react';

export default function UploadCV() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      toast.error('Please choose a file first');
      return;
    }
    setUploading(true);
    try {
      await uploadCv(file);
      toast.success('CV uploaded successfully');
      setFile(null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  // Handle file selection
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Optional: validate file size (max 5MB)
      if (selectedFile.size > 5 * 1024 * 1024) {
        toast.error('File size exceeds 5MB limit');
        e.target.value = ''; // clear input
        return;
      }
      setFile(selectedFile);
    }
  };

  // Remove selected file
  const handleRemoveFile = () => {
    setFile(null);
    // Reset the input value so the same file can be re-selected
    const fileInput = document.getElementById('cv-upload-input');
    if (fileInput) fileInput.value = '';
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
        {/* Header with gradient */}
        <div className="h-28 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 flex items-center justify-center">
          <div className="bg-white/20 backdrop-blur-sm p-3 rounded-full">
            <FileText className="w-10 h-10 text-white" />
          </div>
        </div>

        {/* Title and form */}
        <div className="px-6 pb-6 pt-4 bg-gray-50/50">
          <h1 className="text-2xl font-bold text-gray-800">Upload CV</h1>
          <p className="text-sm text-gray-500 mt-1">Upload your updated CV to apply for jobs</p>

          <form onSubmit={handleSubmit} className="mt-6">
            {/* Drop zone */}
            <label
              htmlFor="cv-upload-input"
              className={`relative block w-full border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
                file
                  ? 'border-green-400 bg-green-50 hover:bg-green-100'
                  : 'border-gray-300 bg-white hover:border-blue-400 hover:bg-blue-50'
              }`}
            >
              <input
                id="cv-upload-input"
                type="file"
                accept=".pdf,.doc,.docx"
                className="hidden"
                onChange={handleFileChange}
              />
              {file ? (
                <div className="flex flex-col items-center">
                  <CheckCircle className="w-12 h-12 text-green-500" />
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
                  <UploadCloud className="w-12 h-12 text-gray-400" />
                  <p className="mt-2 font-semibold text-gray-700">
                    Drag & drop your CV here, or click to browse
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Supports PDF, DOC, DOCX (max 5MB)
                  </p>
                </div>
              )}
            </label>

            {/* Upload button */}
            <button
              type="submit"
              disabled={uploading || !file}
              className="mt-5 w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-2.5 rounded-full shadow-sm transition"
            >
              {uploading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="animate-spin h-5 w-5 text-white" />
                  Uploading...
                </span>
              ) : (
                'Upload CV'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}