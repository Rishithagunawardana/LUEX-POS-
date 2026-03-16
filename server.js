const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;

// Enable CORS so the frontend can talk to this server
app.use(cors());
app.use(express.json());

// Create uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Serve the uploads folder statically
app.use('/uploads', express.static(uploadDir));

// Configure Multer for local storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

// API Endpoint for file upload
app.post('/upload', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).send({ message: 'No file uploaded' });
    }
    
    // Construct the local URL
    const fileUrl = `http://localhost:${port}/uploads/${req.file.filename}`;
    res.send({ imageUrl: fileUrl });
});

app.listen(port, () => {
    console.log(`Open Source Storage Server running at http://localhost:${port}`);
    console.log(`Uploads are stored in: ${uploadDir}`);
});
