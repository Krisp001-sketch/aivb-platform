import { NextResponse } from "next/server";
import { Resend } from "resend";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { user, email_data } = body;

    if (!user || !user.email || !email_data) {
      return NextResponse.json({ error: "Invalid payload from Supabase hook" }, { status: 400 });
    }

    const { token_hash, redirect_to, email_action_type } = email_data;
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
    const confirmUrl = `${supabaseUrl}/auth/v1/verify?token=${token_hash}&type=${email_action_type}&redirect_to=${redirect_to}`;

    const emailSubject = "Confirm your AI Asset Video Builder Account";

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

    let sent = false;

    // 1. Try Resend
    if (process.env.RESEND_API_KEY) {
      try {
        const resend = new Resend(process.env.RESEND_API_KEY);
        const { data, error } = await resend.emails.send({
          from: "AI Asset Video Builder <onboarding@resend.dev>",
          to: user.email,
          subject: emailSubject,
          html: htmlTemplate,
        });

        if (!error && data) {
          console.log("✅ Email successfully sent via Resend:", data.id);
          sent = true;
        } else {
          console.warn("⚠️ Resend rejected email, trying SendPulse...", error);
        }
      } catch (resendErr) {
        console.warn("⚠️ Resend error:", resendErr);
      }
    }

    // 2. Fallback to SendPulse if Resend didn't send
    if (!sent && process.env.SENDPULSE_SMTP_USER && process.env.SENDPULSE_SMTP_PASS) {
      try {
        const sendPulseTransporter = nodemailer.createTransport({
          host: "smtp-pulse.com",
          port: 465,
          secure: true,
          auth: {
            user: process.env.SENDPULSE_SMTP_USER,
            pass: process.env.SENDPULSE_SMTP_PASS,
          },
        });

        await sendPulseTransporter.sendMail({
          from: `"AI Asset Video Builder" <${process.env.SENDPULSE_SMTP_USER}>`,
          to: user.email,
          subject: emailSubject,
          html: htmlTemplate,
        });

        console.log("✅ Email successfully sent via SendPulse fallback!");
        sent = true;
      } catch (spErr) {
        console.error("❌ SendPulse SMTP error:", spErr);
      }
    }

    // Supabase Auth Hook expects an empty object {} on success
    return NextResponse.json({}, { status: 200 });
  } catch (error: any) {
    console.error("❌ Auth email hook internal error:", error);
    return NextResponse.json({}, { status: 200 });
  }
}