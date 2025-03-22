const express = require('express');
const multer = require('multer');
const fs = require('fs');
const pdfParse = require('pdf-parse');
const cors = require('cors');
const PORT = 9001;

const app = express();

app.use(cors());
app.use(express.json());
app.options('/extract-pdf', cors()); // Enable preflight requests for this route

const upload = multer({ dest: 'uploads/' });

app.post('/extract-pdf', upload.single('file'),  async (req, res) => {
    try {
        const pdfBuffer = fs.readFileSync(req?.file?.path);
        const data = await pdfParse(pdfBuffer);
        res.json({ text: data.text });
    } catch (error) {
        console.error('Error extracting PDF contents', error)
        res.status(500).send('Error extracting PDF contents', error);
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});