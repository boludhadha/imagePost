import { useState } from 'react'
import './App.css'

const API_URL = 'https://imageserversyncgram.up.railway.app'

function App() {
  const [selectedFile, setSelectedFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [uploadedUrl, setUploadedUrl] = useState('')
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  const [isDragging, setIsDragging] = useState(false)

  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    if (file) {
      setSelectedFile(file)
      setError('')
      setUploadedUrl('')
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)

    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file)
      setError('')
      setUploadedUrl('')
    } else {
      setError('Please drop an image file')
    }
  }

  const handleUpload = async (e) => {
    e.preventDefault()
    if (!selectedFile) return

    setUploading(true)
    setError('')

    const formData = new FormData()
    formData.append('file', selectedFile)

    try {
      const response = await fetch(`${API_URL}/upload`, {
        method: 'POST',
        body: formData
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setUploadedUrl(data.url)
      } else {
        setError(data.error || 'Upload failed')
      }
    } catch (err) {
      setError(err.message || 'An error occurred during upload')
    } finally {
      setUploading(false)
    }
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(uploadedUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      alert('Failed to copy URL')
    }
  }

  const handleUploadAnother = () => {
    setSelectedFile(null)
    setUploadedUrl('')
    setError('')
    document.getElementById('fileInput').value = ''
  }

  return (
    <div className="container">
      <h1>Image Hosting Service</h1>
      <p className="subtitle">Upload your image and get a shareable URL</p>

      <div className="upload-section">
        {!uploadedUrl ? (
          <>
            <form onSubmit={handleUpload}>
              <div
                className="file-input-wrapper"
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  id="fileInput"
                  accept="image/*"
                  onChange={handleFileSelect}
                  required
                />
                <label
                  htmlFor="fileInput"
                  className={`${selectedFile ? 'file-selected' : ''} ${isDragging ? 'dragging' : ''}`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="48"
                    height="48"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="17 8 12 3 7 8"></polyline>
                    <line x1="12" y1="3" x2="12" y2="15"></line>
                  </svg>
                  <span>
                    {isDragging
                      ? 'Drop image here'
                      : selectedFile
                        ? selectedFile.name
                        : 'Click or drag & drop an image'}
                  </span>
                </label>
              </div>
              <button
                type="submit"
                disabled={!selectedFile || uploading}
              >
                {uploading ? 'Uploading...' : 'Upload Image'}
              </button>
            </form>

            {uploading && (
              <div className="loading">
                <div className="spinner"></div>
                <p>Uploading...</p>
              </div>
            )}

            {error && (
              <div className="error">
                <p>{error}</p>
              </div>
            )}
          </>
        ) : (
          <div className="result">
            <div className="success-icon">✓</div>
            <h3>Upload Successful!</h3>
            <div className="url-box">
              <input
                type="text"
                value={uploadedUrl}
                readOnly
              />
              <button
                onClick={handleCopy}
                className={copied ? 'copied' : ''}
              >
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <div className="preview">
              <img src={uploadedUrl} alt="Uploaded" />
            </div>
            <button onClick={handleUploadAnother} className="upload-another">
              Upload Another Image
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default App