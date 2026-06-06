import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { email, firstName, accountType } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required." });
    }

    const name = firstName || "there";
    const isWorker = accountType === "worker";

    const subject = isWorker
      ? "Welcome to TaskMint Worker"
      : "Welcome to TaskMint";

    const html = isWorker
      ? `
        <div style="font-family: Arial, sans-serif; line-height:1.6; color:#111;">
          <h2>Welcome to TaskMint, ${name}!</h2>
          <p>Your worker account has been created.</p>
          <p>Before you can send quotes, complete your worker profile, service area, and payout information.</p>
          <p>Once approved, you’ll be able to browse tasks and submit quotes.</p>
          <p>Thank you for joining TaskMint.</p>
        </div>
      `
      : `
        <div style="font-family: Arial, sans-serif; line-height:1.6; color:#111;">
          <h2>Welcome to TaskMint, ${name}!</h2>
          <p>Your customer account has been created.</p>
          <p>You can now post tasks, receive worker quotes, message workers, and manage your jobs in one place.</p>
          <p>Need help? Contact support.team@trytaskmint.com.</p>
          <p>Thank you for joining TaskMint.</p>
        </div>
      `;

    await resend.emails.send({
      from: "TaskMint <support.team@trytaskmint.com>",
      to: email,
      subject: subject,
      html: html
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Welcome email error:", error);
    return res.status(500).json({ error: "Unable to send welcome email." });
  }
}
