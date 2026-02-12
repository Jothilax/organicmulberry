import nodemailer from "nodemailer";
import twilio from "twilio";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

export const sendEmailOTP = async (to, otp) => {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject: "Your OTP Code",
    text: `Your OTP code is: ${otp}. Valid for 5 minutes.`,
  });
};

export const sendSMSOTP = async (to, otp) => {
  // await client.messages.create({
  //   body: `Your OTP code is: ${otp}. Valid for 5 minutes.`,
  //   from: process.env.TWILIO_PHONE,
  //   to,
  // });


await client.verify.v2
  .services(process.env.TWILIO_VERIFY_SERVICE_SID)
  .verifications.create({
    to: "+916383061117",
    channel: "sms",
  });
};

