module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  try {
    const {
      workerId,
      workerEmail,
      category,
      subject,
      message
    } = req.body;

    if (!workerId || !workerEmail || !category || !subject || !message) {
      return res.status(400).json({
        error: "Missing required support ticket information."
      });
    }

    return res.status(200).json({
      success: true,
      supportEmail: "worker.support@trytaskmint.com",
      ticket: {
        workerId,
        workerEmail,
        category,
        subject,
        message,
        status: "open"
      }
    });

  } catch (error) {
    return res.status(500).json({
      error: error.message
    });
  }
};
