import React, { useState, useRef } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { BookOpen, Upload as UploadIcon, Camera, FileText, PenTool, CreditCard, HelpCircle, FileCheck } from 'lucide-react';

const UploadPage = ({ onBack }) => {
  const { isDarkMode } = useTheme();
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileUpload = async (files) => {
    const newFiles = Array.from(files).map(file => ({
      id: Date.now() + Math.random(),
      name: file.name,
      type: file.type,
      size: file.size,
      uploadedAt: new Date()
    }));
    
    setUploadedFiles(prev => [...prev, ...newFiles]);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files);
    }
  };

  const generateFlashcards = (file) => {
    alert(`Generating flashcards from "${file.name}"`);
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <div className={`shadow-sm border-b ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button 
                onClick={onBack}
                className={`flex items-center font-medium ${
                  isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                ← Back to Features
              </button>
              <h1 className={`text-2xl font-bold ${
                isDarkMode 
                  ? 'text-white' 
                  : 'bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent'
              }`}>Upload Notes</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        {/* Upload Section */}
        <div className={`rounded-xl shadow-sm border p-8 mb-8 ${
          isDarkMode 
            ? 'bg-gray-800 border-gray-700' 
            : 'bg-white border-gray-100'
        }`}>
          <div className="mb-8">
            <BookOpen className="w-16 h-16 text-blue-600 mb-4" />
            <h2 className={`text-3xl font-bold mb-2 ${
              isDarkMode 
                ? 'text-white' 
                : 'bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent'
            }`}>Transform Your Notes</h2>
            <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Upload your study materials and turn them into interactive learning tools</p>
          </div>

          {/* Drag & Drop Area */}
          <div
            className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors ${
              dragActive 
                ? 'border-blue-400 ' + (isDarkMode ? 'bg-blue-900/20' : 'bg-blue-50')
                : isDarkMode
                  ? 'border-gray-600 hover:border-blue-400 hover:bg-blue-900/20'
                  : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <UploadIcon className={`w-12 h-12 mb-4 mx-auto ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
            <h3 className={`text-xl font-semibold mb-2 ${
              isDarkMode 
                ? 'text-white' 
                : 'bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent'
            }`}>Drop files here or click to upload</h3>
            <p className={`mb-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Support for PDF, JPG, PNG, DOC, DOCX files</p>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
            >
              Choose Files
            </button>
          </div>

          {/* Upload Options */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <button
              onClick={() => fileInputRef.current?.click()}
              className={`p-6 border rounded-xl transition-colors ${
                isDarkMode 
                  ? 'border-gray-600 hover:border-blue-400 hover:bg-blue-900/20' 
                  : 'border-gray-200 hover:border-blue-400 hover:bg-blue-50'
              }`}
            >
              <Camera className={`w-8 h-8 mb-3 mx-auto ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
              <div className={`font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Take Photo</div>
              <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Capture notes or whiteboard</div>
            </button>
            
            <button
              onClick={() => fileInputRef.current?.click()}
              className={`p-6 border rounded-xl transition-colors ${
                isDarkMode 
                  ? 'border-gray-600 hover:border-blue-400 hover:bg-blue-900/20' 
                  : 'border-gray-200 hover:border-blue-400 hover:bg-blue-50'
              }`}
            >
              <FileText className={`w-8 h-8 mb-3 mx-auto ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
              <div className={`font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Upload PDF</div>
              <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Textbooks and handouts</div>
            </button>
            
            <button
              onClick={() => fileInputRef.current?.click()}
              className={`p-6 border rounded-xl transition-colors ${
                isDarkMode 
                  ? 'border-gray-600 hover:border-blue-400 hover:bg-blue-900/20' 
                  : 'border-gray-200 hover:border-blue-400 hover:bg-blue-50'
              }`}
            >
              <PenTool className={`w-8 h-8 mb-3 mx-auto ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
              <div className={`font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Handwritten Notes</div>
              <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Scan your writing</div>
            </button>
          </div>
        </div>

        {/* Uploaded Files */}
        {uploadedFiles.length > 0 && (
          <div className={`rounded-xl shadow-sm border p-6 ${
            isDarkMode 
              ? 'bg-gray-800 border-gray-700' 
              : 'bg-white border-gray-100'
          }`}>
            <h3 className={`text-xl font-bold mb-6 ${
              isDarkMode 
                ? 'text-white' 
                : 'bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent'
            }`}>Your Uploaded Files</h3>
            <div className="space-y-4">
              {uploadedFiles.map(file => (
                <div key={file.id} className={`border rounded-lg p-6 ${
                  isDarkMode ? 'border-gray-600' : 'border-gray-200'
                }`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <FileCheck className="w-8 h-8 text-blue-600 mt-1" />
                      <div>
                        <h4 className={`font-semibold text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{file.name}</h4>
                        <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>Uploaded {file.uploadedAt.toLocaleDateString()}</p>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => generateFlashcards(file)}
                        className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm hover:bg-blue-200 font-medium flex items-center space-x-1"
                      >
                        <CreditCard className="w-4 h-4" /><span>Flashcards</span>
                      </button>
                      <button className="px-4 py-2 bg-green-100 text-green-700 rounded-lg text-sm hover:bg-green-200 font-medium flex items-center space-x-1">
                        <FileText className="w-4 h-4" /><span>Quiz</span>
                      </button>
                      <button className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg text-sm hover:bg-indigo-200 font-medium flex items-center space-x-1">
                        <FileCheck className="w-4 h-4" /><span>Summary</span>
                      </button>
                      <button className="px-4 py-2 bg-orange-100 text-orange-700 rounded-lg text-sm hover:bg-orange-200 font-medium flex items-center space-x-1">
                        <HelpCircle className="w-4 h-4" /><span>Q&A</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
        onChange={(e) => handleFileUpload(e.target.files)}
        className="hidden"
      />
    </div>
  );
};

export default UploadPage;