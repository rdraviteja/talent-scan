const express = require('express');
const multer = require('multer');
const fs = require('fs');
const pdfParse = require('pdf-parse');
const cors = require('cors');
const emailService = require('./emailService');
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

app.get('/sendEmail', async (req, res) => {
    try {
        const { to, subject, text, html } = req.query
        const data = sendSimpleEmail(to, subject, text, html)
        res.json({ text: data.text });
    } catch (error) {
        console.error('Error extracting PDF contents', error)
        res.status(500).send('Error extracting PDF contents', error);
    }
});

// Simple email
async function sendSimpleEmail(to, subject, text, html) {
  const result = await emailService.sendEmail({
    to,
    subject,
    text,
    html
  });
  console.log('result:', result);
  if (result.success) {
    console.log('Email sent successfully:', result.messageId);
    return result.messageId
  } else {
    console.error('Failed to send email:', result.error);
  }
}

// Template-based email
async function sendWelcomeEmail(userData) {
  const result = await emailService.sendTemplateEmail({
    to: userData.email,
    template: 'welcome',
    data: {
      subject: 'Welcome to Our Platform',
      name: userData.name,
      message: 'Thank you for joining us!'
    }
  });

  if (result.success) {
    console.log('Welcome email sent successfully');
  } else {
    console.error('Failed to send welcome email:', result.error);
  }
}

// Email with attachments
async function sendEmailWithAttachment() {
  const result = await emailService.sendEmail({
    to: 'recipient@example.com',
    subject: 'Email with Attachment',
    text: 'Please find the attached document',
    html: '<h1>Please find the attached document</h1>',
    attachments: [
      {
        filename: 'document.pdf',
        path: '/path/to/document.pdf'
      }
    ]
  });

  if (result.success) {
    console.log('Email with attachment sent successfully');
  } else {
    console.error('Failed to send email with attachment:', result.error);
  }
}


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});