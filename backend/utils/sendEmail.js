// import nodemailer from "nodemailer";
// import dotenv from "dotenv";
// dotenv.config();

// const transporter = nodemailer.createTransport({
//   // service: "gmail",
//    host: "smtp.gmail.com",
//   port: 465,
//   secure: true,
//    connectionTimeout: 10000,
//   greetingTimeout: 10000,
//   socketTimeout: 10000,
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });


// export const sendEmail = async (to, otp) => {
//   await transporter.sendMail({
//     from: process.env.EMAIL_USER,
//     to,
//     subject: "Your OTP Code",
//     text: `Your OTP is ${otp}. It will expire in 5 minutes.`,
//   });
// };

// transporter.verify((error, success) => {
//   if (error) {
//     console.log("SMTP ERROR:", error);
//   } else {
//     console.log("SMTP SERVER READY");
//   }
// });

import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async (to, otp) => {
  try {
    const response = await resend.emails.send({
      from: "onboarding@resend.dev",
      to,
      subject: "Your OTP Code",
      html: `
        <h2>Your OTP Code</h2>
        <p>Your OTP is:</p>
        <h1>${otp}</h1>
        <p>It will expire in 5 minutes.</p>
      `,
    });

    console.log("Email sent:", response);
  } catch (error) {
    console.error("Resend error:", error);
    throw error;
  }
};