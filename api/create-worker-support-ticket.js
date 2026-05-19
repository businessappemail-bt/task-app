const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

module.exports = async (req, res) => {

  res.setHeader("Access-Control-Allow-Origin", "*");

  res.setHeader(
    "Access-Control-Allow-Methods",
    "POST, OPTIONS"
  );

  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type"
  );

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

    if (
      !workerId ||
      !workerEmail ||
      !category ||
      !subject ||
      !message
    ) {

      return res.status(400).json({
        error:
          "Missing required support ticket information."
      });

    }

    const { data, error } =
      await supabase
        .from("worker_support_tickets")
        .insert({
          worker_id: workerId,
          worker_email: workerEmail,
          category: category,
          subject: subject,
          message: message,
          status: "open"
        })
        .select()
        .single();

    if (error) {

      console.error(error);

      return res.status(500).json({
        error:
          "Unable to save support ticket."
      });

    }

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
