import { useState } from 'react';
import toast from 'react-hot-toast';
import { uploadCv } from '../../api/profileApi';

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
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
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
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
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