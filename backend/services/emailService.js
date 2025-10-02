import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendPasswordResetEmail(to, token) {
  const port = 3000;
  const appUrl = `http://localhost:${port}`;
  const resetUrl = `${appUrl}/reset-password?token=${encodeURIComponent(token)}`;

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject: "איפוס סיסמה - RentMate",
    html: `
      <p>שלום,</p>
      <p>קיבלת בקשה לאיפוס סיסמה.</p>
      <p>לחץ על הקישור כדי לבחור סיסמה חדשה (בתוקף ל-2 שעות):</p>
      <p><a href="${resetUrl}" target="_blank">${resetUrl}</a></p>
      <p>אם לא ביקשת איפוס סיסמה – התעלם מהמייל.</p>
    `,
  });
}
