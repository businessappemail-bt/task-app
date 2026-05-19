const { createClient } = require("@supabase/supabase-js");
const { Resend } = require("resend");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const resend = new Resend(process.env.RESEND_API_KEY);

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { workerId, workerEmail, category, subject, message } = req.body;

    if (!workerId || !workerEmail || !category || !subject || !message) {
      return res.status(400).json({
        error: "Missing required support ticket information."
      });
    }

    const { data, error } = await supabase
      .from("worker_support_tickets")
      .insert({
        worker_id: workerId,
        worker_email: workerEmail,
        category,
        subject,
        message,
        status: "open"
      })
      .select()
      .single();

    if (error) {
      console.error(error);
      return res.status(500).json({
        error: "Unable to save support ticket."
      });
    }

    await resend.emails.send({
      from: "TaskMint Support <btobler@trytaskmint.com>",
      to: process.env.ZOHO_WORKER_DESK_EMAIL,
      replyTo: workerEmail,
      subject: `Worker Support Ticket: ${subject}`,
      html: `
        <h2>New Worker Support Ticket</h2>
        <p><strong>Ticket ID:</strong> ${data.id}</p>
        <p><strong>Worker Email:</strong> ${workerEmail}</p>
        <p><strong>Worker ID:</strong> ${workerId}</p>
        <p><strong>Category:</strong> ${category}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, "<br>")}</p>
      `
    });

    return res.status(200).json({
      success: true,
      ticket: data
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: error.message
    });
  }
};
