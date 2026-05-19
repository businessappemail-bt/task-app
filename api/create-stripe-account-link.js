const Stripe = require("stripe");

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

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
      taskId,
      customerEmail,
      amount,
      taskTitle
    } = req.body;

    if (!taskId || !customerEmail || !amount) {
      return res.status(400).json({
        error: "Missing required payment information."
      });
    }

    const amountInCents = Math.round(Number(amount) * 100);

    const session = await stripe.checkout.sessions.create({
      mode: "payment",

      customer_email: customerEmail,

      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: taskTitle || "TaskMint Task Payment"
            },
            unit_amount: amountInCents
          },
          quantity: 1
        }
      ],

      payment_method_types: ["card"],

      payment_intent_data: {
        metadata: {
          task_id: taskId,
          customer_email: customerEmail
        }
      },

      success_url:
        "https://businessappemail-bt.github.io/task-app/payment-success.html",

      cancel_url:
        "https://businessappemail-bt.github.io/task-app/payment-cancelled.html"
    });

    return res.status(200).json({
      url: session.url
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: error.message
    });
  }
};
