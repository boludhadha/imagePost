// Configuration - Update this with your Railway backend URL after deployment
const API_URL = 'https://your-backend-url.railway.app';

const fileInput = document.getElementById('fileInput');
const fileLabel = document.getElementById('fileLabel');
const uploadForm = document.getElementById('uploadForm');
const uploadBtn = document.getElementById('uploadBtn');
const loading = document.getElementById('loading');
const result = document.getElementById('result');
const error = document.getElementById('error');
const imageUrl = document.getElementById('imageUrl');
const copyBtn = document.getElementById('copyBtn');
const previewImage = document.getElementById('previewImage');
const uploadAnother = document.getElementById('uploadAnother');
const errorMessage = document.getElementById('errorMessage');

// File selection
fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        fileLabel.classList.add('file-selected');
        fileLabel.querySelector('span').textContent = file.name;
        uploadBtn.disabled = false;
    }
});

// Form submission
uploadForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const file = fileInput.files[0];
    if (!file) return;

    // Hide previous results
    result.classList.add('hidden');
    error.classList.add('hidden');
    uploadForm.classList.add('hidden');
    loading.classList.remove('hidden');

    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await fetch(`${API_URL}/upload`, {
            method: 'POST',
            body: formData
        });

        const data = await response.json();

        if (response.ok && data.success) {
            // Show result
            imageUrl.value = data.url;
            previewImage.src = data.url;
            loading.classList.add('hidden');
            result.classList.remove('hidden');
        } else {
            throw new Error(data.error || 'Upload failed');
        }
    } catch (err) {
        loading.classList.add('hidden');
        error.classList.remove('hidden');
        errorMessage.textContent = err.message || 'An error occurred during upload';
        uploadForm.classList.remove('hidden');
    }
});

// Copy URL to clipboard
copyBtn.addEventListener('click', async () => {
    try {
        await navigator.clipboard.writeText(imageUrl.value);
        copyBtn.textContent = 'Copied!';
        copyBtn.classList.add('copied');

        setTimeout(() => {
            copyBtn.textContent = 'Copy';
            copyBtn.classList.remove('copied');
        }, 2000);
    } catch (err) {
        alert('Failed to copy URL');
    }
});

// Upload another image
uploadAnother.addEventListener('click', () => {
    result.classList.add('hidden');
    uploadForm.classList.remove('hidden');
    fileInput.value = '';
    fileLabel.classList.remove('file-selected');
    fileLabel.querySelector('span').textContent = 'Click to select an image';
    uploadBtn.disabled = true;
});