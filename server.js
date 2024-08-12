const express = require('express');
const multer = require('multer');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3004;

// In-memory storage for uploaded files (no actual storage)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Load last photo number from file
let photoNumber = 0;
const photoNumberFile = 'photoNumber.json';

if (fs.existsSync(photoNumberFile)) {
  const data = fs.readFileSync(photoNumberFile);
  photoNumber = JSON.parse(data).lastPhotoNumber;
}

// Define the home route to serve index.html from the public directory
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// Endpoint to handle photo uploads
app.post('/upload', upload.array('photos'), (req, res) => {
  if (!req.files) {
    return res.status(400).json({ error: 'No files uploaded.' });
  }

  const currentYear = new Date().getFullYear(); // Get the current year
  const renamedFiles = req.files.map(file => {
    const newFileName = `${currentYear}_${++photoNumber}_${file.originalname}`;
    return {
      name: newFileName,
      buffer: file.buffer // Store the file buffer for downloading
    };
  });

  // Save the last photo number
  fs.writeFileSync(photoNumberFile, JSON.stringify({ lastPhotoNumber: photoNumber }));

  // Send back the renamed files as JSON
  res.json(renamedFiles);
});

// Serve static files from the public directory
app.use(express.static('public'));

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});