import nodemailer from 'nodemailer';
import { render } from '@react-email/render';
import NotificationEmail from '@/emails/NotificationEmail';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export async function sendEmail(
  to: string,
  subject: string,
  message: string,
  link?: string
) {
  try {
    const html = render(
      NotificationEmail({
        subject,
        message,
        actionLink: link,
      })
    );

    const mailOptions = {
      from: `${process.env.SITE_NAME} <${process.env.SMTP_FROM}>`,
      to,
      subject,
      html,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Email send error:', error);
    throw error;
  }
} 