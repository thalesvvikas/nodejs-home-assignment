const { Worker } = require('bullmq');
const Redis = require('ioredis');
const nodemailer = require('nodemailer');
require('dotenv').config();

const connection = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  maxRetriesPerRequest: null,
});

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

new Worker(
  'emailQueue',
  async (job) => {
    const { to, subject, text } = job.data;
    try {
      const info = await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to,
        subject,
        text,
      });
      console.log(`Email sent to ${to} (job ${job.id})`);
      console.log('Message ID:', info.messageId);
    } catch (err) {
      console.error('Failed to send email:', err);
    }
  },
  { connection }
);
