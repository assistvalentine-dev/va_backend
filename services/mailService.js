import axios from "axios";

export const sendVerificationEmail = async (email, otp) => {
  try {
    const response = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: {
          name: "Blind Dating Support",
          email: "gauravbora2273@gmail.com"   // must be verified in Brevo
        },
        to: [
          { email }
        ],
        subject: "🔐 Your Blind Dating Verification Code",
        htmlContent: `
        <h2>Your OTP</h2>
        <h1>${otp}</h1>
        <p>Valid for 10 minutes.</p>
        `
      },
      {
        headers: {
          "Content-Type": "application/json",
          "api-key": process.env.BREVO_API_KEY   // <-- THIS IS THE FIX
        }
      }
    );

    console.log("Brevo success:", response.data);
    return true;

  } catch (error) {
    console.error("Brevo API error:", error.response?.data || error);
    return false;
  }
};
