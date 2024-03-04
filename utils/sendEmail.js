import 'dotenv/config';
import nodemailer from 'nodemailer';
import hbs from 'nodemailer-express-handlebars';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// __dirname is not available in ES6 modules, so you have to create it
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const sendEmail = async (
  subject,
  send_to,
  sent_from,
  reply_to,
  template,
  name,
  link
) => {
  // Create Email Transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: 587,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  const handlebarOptions = {
    viewEngine: {
      extName: ".handlebars",
      partialsDir: path.resolve(__dirname, "./views"),
      defaultLayout: false,
    },
    viewPath: path.resolve(__dirname, "./views"),
    extName: ".handlebars",
  };

  transporter.use("compile", hbs(handlebarOptions));

  // Options for sending email
  const options = {
    from: sent_from,
    to: send_to,
    replyTo: reply_to,
    subject,
    template,
    context: {
      name,
      link,
    },
  };

  // Send Email
  try {
    const info = await transporter.sendMail(options);
    console.log(info);
  } catch (err) {
    console.error(err);
  }
};

export default sendEmail;