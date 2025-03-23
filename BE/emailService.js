const nodemailer = require('nodemailer');

const SMTP_HOST = "smtp.gmail.com"
const SMTP_PORT = "587"
const SMTP_USER = "syamk46@gmail.com"
const SMTP_PASSWORD = "jmhd gguc zmyf pvbx"
const EMAIL_FROM="your-email@gmail.com"

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // true for 465, false for 587
  auth: {
    user: SMTP_USER, // your Gmail address
    pass: SMTP_PASSWORD // the generated App password
  }
});

class EmailService {
  constructor() {
    // Verify connection configuration
    transporter.verify((error, success) => {
      if (error) {
        console.error('SMTP connection error:', error);
      } else {
        console.log('Server is ready to send emails');
      }
    });
  }

  async sendEmail({ to, subject, text, html, attachments = [] }) {
    try {
      const mailOptions = {
        from: SMTP_USER,
        to,
        subject,
        text,
        html,
        attachments
      };

      const info = await transporter.sendMail(mailOptions);
      return {
        success: true,
        messageId: info.messageId
      };
    } catch (error) {
      console.error('Email sending failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Method for sending template-based emails
  async sendTemplateEmail({ to, template, data }) {
    try {
      const htmlContent = await this.generateEmailTemplate(template, data);
      
      return this.sendEmail({
        to,
        subject: data.subject,
        html: htmlContent,
        text: data.plainText || ''
      });
    } catch (error) {
      console.error('Template email sending failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Helper method to generate email template
  async generateEmailTemplate(templateName, data) {
    // Add your template logic here
    // This is a simple example
    const templates = {
      welcome: `
        <h1>Welcome ${data.name}!</h1>
        <p>${data.message}</p>
      `,
      notification: `
        <h2>${data.title}</h2>
        <p>${data.message}</p>
      `
    };

    return templates[templateName] || '';
  }
}

module.exports = new EmailService();
