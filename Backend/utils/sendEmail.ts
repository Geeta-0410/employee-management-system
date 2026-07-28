import dotenv from "dotenv";
dotenv.config();

import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: process.env.EMAIL_USER && process.env.EMAIL_PASS ? {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  } : undefined,
  connectionTimeout: 30000,
  greetingTimeout: 30000,
  socketTimeout: 30000,
});

export const sendOTPEmail = async (email: string, otp: string) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn(
      "EMAIL_USER or EMAIL_PASS is not set. Skipping OTP email delivery.",
      { email, otp },
    );
    return;
  }

  try {
    console.log("Sending OTP...");

    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Employee Management - Email Verification",
      html: `<h2>Your OTP is ${otp}</h2>`,
    });

    console.log("Mail sent:", info.messageId);
  } catch (err) {
    console.error("SendMail Error:", err);
    console.warn(
      "OTP email delivery failed, but signup will continue. Verify OTP manually or fix email config.",
    );
  }
};
export const sendEmployeeCredentialsEmail = async (
  email: string,
  employeeName: string,
  tempPassword: string,
) => {
  console.log("Sending Employee Credentials To:", email);

  await transporter.sendMail({
    from: process.env.EMAIL_USER,

    to: email,

    subject: "Employee Account Created",

    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        
        <h2>Hello ${employeeName},</h2>

        <p>
          Your employee account has been created successfully.
        </p>

        <p>
          <strong>Email:</strong>
          ${email}
        </p>

        <p>
          <strong>Temporary Password:</strong>
          ${tempPassword}
        </p>

        <p>
          Please login using these credentials and
          change your password after first login.
        </p>

        <br/>

        <p>
          Regards,<br/>
          Employee Management Team
        </p>

      </div>
    `,
  });

  console.log("Employee Credential Mail Sent Successfully");
};
