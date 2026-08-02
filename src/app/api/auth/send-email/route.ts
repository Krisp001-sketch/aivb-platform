import { NextResponse } from "next/server";
import { Resend } from "resend";
import nodemailer from "nodemailer";

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// Initialize SendPulse SMTP Transporter
const sendPulseTransporter = nodemailer.createTransport({
  host: "smtp-pulse.com",
  port: 465,
  secure: true, // SSL
  auth: {
    user: process.env.SENDPULSE_SMTP_USER,
    pass: process.env.SENDPULSE_SMTP_PASS,
  },
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { user, email_data } = body;
    const { token_hash, redirect_to, email_action_type } = email_data;

    // Construct the Supabase Verification URL
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const confirmUrl = `${supabaseUrl}/auth/v1/verify?token=${token_hash}&type=${email_action_type}&redirect_to=${redirect_to}`;

    const emailSubject = "Confirm your AI Asset Video Builder Account";

    // Dark-themed HTML Email Template matching platform UI
    const htmlTemplate = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #09090b; color: #ffffff; padding: 40px 20px; margin: 0; }
          .container { max-width: 480px; margin: 0 auto; background: #18181b; border-radius: 16px; border: 1px solid #27272a; padding: 36px 28px; text-align: center; }
          .logo { display: inline-block; width: 48px; height: 48px; background: #2563eb; border-radius: 12px; line-height: 48px; font-weight: bold; font-size: 22px; color: #ffffff; margin-bottom: 20px; }
          .title { font-size: 22px; font-weight: 700; color: #ffffff; margin-bottom: 8px; letter-spacing: -0.5px; }
          .text { color: #a1a1aa; font-size: 14px; line-height: 1.6; margin-bottom: 28px; }
          .btn { display: inline-block; background-color: #2563eb; color: #ffffff; font-weight: 600; text-decoration: none; padding: 12px 32px; border-radius: 8px; font-size: 14px; }
          .footer { font-size: 12px; color: #52525b; margin-top: 32px; border-top: 1px solid #27272a; padding-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="logo">⚡</div>
          <div class="title">AI Asset Video Builder</div>
          <p class="text">Welcome! Click the button below to confirm your email address and activate your account.</p>
          <a href="${confirmUrl}" class="btn">Verify Email Address</a>
          <div class="footer">If you did not request this email, you can safely ignore it.</div>
        </div>
      </body>
      </html>
    `;

    // 1. Try sending with Resend (Primary)
    try {
      await resend.emails.send({
        from: "AI Asset Video Builder <onboarding@resend.dev>",
        to: user.email,
        subject: emailSubject,
        html: htmlTemplate,
      });
      console.log("✅ Email sent via Resend");
      return NextResponse.json({ success: true, provider: "resend" });
    } catch (resendError) {
      console.warn("⚠️ Resend failed/limited. Falling back to SendPulse...", resendError);

      // 2. Fallback to SendPulse (Secondary)
      await sendPulseTransporter.sendMail({
        from: `"AI Asset Video Builder" <${process.env.SENDPULSE_SMTP_USER}>`,
        to: user.email,
        subject: emailSubject,
        html: htmlTemplate,
      });

      console.log("✅ Email sent via SendPulse fallback");
      return NextResponse.json({ success: true, provider: "sendpulse" });
    }
  } catch (error: any) {
    console.error("❌ Auth email hook error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}