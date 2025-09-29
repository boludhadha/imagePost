# Image Hosting Service

A simple, lossless image hosting service with a Flask backend and vanilla HTML/CSS/JS frontend.

## Features
- Upload images and get shareable URLs
- Lossless storage (original quality preserved)
- No authentication required
- Public access for all images
- Support for PNG, JPG, JPEG, GIF, WebP, SVG, BMP, ICO
- Max file size: 50MB

## Project Structure
```
imageServer/
├── app.py                  # Flask backend
├── requirements.txt        # Python dependencies
├── Procfile               # Railway deployment config
├── railway.json           # Railway configuration
├── runtime.txt            # Python version
├── RAILWAY_DEPLOY.md      # Backend deployment guide
├── VERCEL_DEPLOY.md       # Frontend deployment guide
└── frontend/
    ├── index.html         # Main page
    ├── style.css          # Styling
    ├── script.js          # Upload logic
    └── vercel.json        # Vercel configuration
```

## Local Development

### Backend
```bash
# Install dependencies
pip install -r requirements.txt

# Run the server
python app.py
```
Backend runs on `http://localhost:5000`

### Frontend
Open `frontend/index.html` in a browser, or use a local server:
```bash
cd frontend
python -m http.server 8000
```
Frontend available at `http://localhost:8000`

**Important**: Update `API_URL` in `frontend/script.js` to point to your backend URL.

## Deployment

### Backend (Railway)
See [RAILWAY_DEPLOY.md](RAILWAY_DEPLOY.md) for detailed instructions.

### Frontend (Vercel)
See [VERCEL_DEPLOY.md](VERCEL_DEPLOY.md) for detailed instructions.

## How It Works
1. User uploads an image via the frontend
2. Frontend sends the file to the backend `/upload` endpoint
3. Backend saves the file with a unique UUID filename
4. Backend returns a public URL
5. User can share the URL - images are served via `/images/<filename>`

## API Endpoints

### `POST /upload`
Upload an image file.

**Request**: `multipart/form-data` with `file` field

**Response**:
```json
{
  "success": true,
  "url": "https://your-backend.railway.app/images/abc123.png",
  "filename": "abc123.png"
}
```

### `GET /images/<filename>`
Retrieve an uploaded image.

**Response**: Image file

## Environment Variables

### Backend
- `PORT` - Port to run the server (automatically set by Railway)
- `UPLOAD_FOLDER` - Directory to store uploads (set to `/app/uploads` on Railway)

## Notes
- Images are stored with lossless quality (no compression)
- Files are renamed with UUID to prevent conflicts
- CORS is enabled for all origins
- Railway volumes ensure persistent storage across deployments