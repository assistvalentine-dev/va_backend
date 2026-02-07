import nodemailer from "nodemailer";

export const sendVerificationEmail = async (email, otp) => {

  try {
  // transporter (using Gmail here, but you can use any SMTP service)
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
        user: process.env.EMAIL_USER,  
        pass: process.env.EMAIL_PASS   
        }
    });

    const mailOptions = {
    from: `"Blind Dating Support" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "🔐 Your Blind Dating Verification Code",
    text: `Your OTP for Blind Dating verification is: ${otp}. This code is valid for 10 minutes.`,
    html: `
    <div style="
        font-family: Arial, Helvetica, sans-serif;
        background: #0f172a;
        color: #e5e7eb;
        padding: 20px;
    ">
        <div style="
        max-width: 500px;
        margin: auto;
        background: #111827;
        border-radius: 12px;
        padding: 24px;
        text-align: center;
        border: 1px solid #374151;
        ">

        <h2 style="color:#f472b6; margin-bottom: 10px;">
            ✨ Blind Dating Verification
        </h2>

        <p style="color:#d1d5db;">
            Thanks for joining Blind Dating!  
            Use the OTP below to verify your email.
        </p>

        <div style="
            font-size: 32px;
            letter-spacing: 6px;
            font-weight: bold;
            background: #18181b;
            padding: 15px;
            border-radius: 8px;
            margin: 20px 0;
            color: #f472b6;
        ">
            ${otp}
        </div>

        <p style="color:#9ca3af; font-size: 14px;">
            This code is valid for <b>10 minutes</b>.  
            If you didn’t request this, you can safely ignore this email.
        </p>

        <hr style="border-color:#374151; margin:20px 0;" />

        <p style="color:#9ca3af; font-size: 12px;">
            Blind Dating • Secure & Private Matching  
            <br/>
            Need help? Contact: assistvalentine@gmail.com
        </p>
        </div>
    </div>
    `
    };


    const info = await transporter.sendMail(mailOptions);
    return true; // Email sent successfully
  
  } catch (error) {
    console.error("Email sending error:", error);
    return false; // Failed to send email
  }

};
