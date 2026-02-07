import dotenv from 'dotenv';
dotenv.config();
import { Resend } from "resend";


const resend = new Resend(process.env.RESEND_API_KEY);
console.log("Resend API Key:", process.env.RESEND_API_KEY); // Debugging line
export const sendVerificationEmail = async (email, otp) => {
  try {
    const data = await resend.emails.send({
      from: "Blind Dating <noreply@resend.dev>",   // IMPORTANT
      to: email,
      subject: "Your Verification OTP",
      html: `
        <h2>Your OTP Code</h2>
        <p>Your one-time password is:</p>
        <h1>${otp}</h1>
        <p>This code expires in 10 minutes.</p>
      `
    });

    console.log("Email sent:", data);
    return true;

  } catch (error) {
    console.error("Email failed:", error);
    return false;
  }
};
