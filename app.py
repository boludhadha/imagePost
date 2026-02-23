import os
import uuid
from flask import Flask, request, jsonify, send_from_directory, redirect
from flask_cors import CORS
from werkzeug.utils import secure_filename

app = Flask(__name__)
CORS(app)

# Configuration
UPLOAD_FOLDER = os.environ.get('UPLOAD_FOLDER', './uploads')
MAX_FILE_SIZE = 50 * 1024 * 1024  # 50MB
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp', 'svg', 'bmp', 'ico', 'pdf'}

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = MAX_FILE_SIZE

# Create upload folder if it doesn't exist
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/')
def index():
    return jsonify({
        'message': 'Image & file hosting service is running',
        'api': '/api',
        'endpoints': {
            'upload': 'POST /upload or POST /api/upload',
            'view': 'GET /files/<filename>'
        }
    })


# --- Exposeable API ---

@app.route('/api')
def api_info():
    """API discovery and documentation for external clients."""
    base = request.host_url.rstrip('/')
    return jsonify({
        'name': 'Image & File Hosting API',
        'version': '1.1',
        'base_url': base,
        'endpoints': {
            'upload': {
                'method': 'POST',
                'path': '/api/upload',
                'description': 'Upload an image (PNG, JPG, GIF, WebP, SVG, BMP, ICO) or PDF',
                'request': 'multipart/form-data with field "file"',
                'max_size_mb': 50,
                'response': {'success': True, 'url': '<public URL>', 'filename': '<uuid>.<ext>'}
            },
            'get_file': {
                'method': 'GET',
                'path': '/files/<filename>',
                'description': 'Retrieve an uploaded file by filename (from upload response)'
            }
        },
        'allowed_types': list(ALLOWED_EXTENSIONS)
    })


@app.route('/api/upload', methods=['POST'])
@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400

    file = request.files['file']

    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400

    if not allowed_file(file.filename):
        return jsonify({'error': 'File type not allowed'}), 400

    # Generate unique filename
    ext = secure_filename(file.filename).rsplit('.', 1)[1].lower()
    unique_filename = f"{uuid.uuid4().hex}.{ext}"

    # Save file
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], unique_filename)
    file.save(filepath)

    # Get the base URL (will work on Railway)
    base_url = request.host_url.rstrip('/')
    file_url = f"{base_url}/files/{unique_filename}"

    return jsonify({
        'success': True,
        'url': file_url,
        'filename': unique_filename
    }), 201


@app.route('/files/<filename>')
def serve_file(filename):
    """Serve any uploaded file (images and PDFs)."""
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)


@app.route('/images/<filename>')
def serve_image_redirect(filename):
    """Redirect old /images/ URLs to /files/ for backward compatibility."""
    return redirect(f"/files/{filename}", code=302)

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)