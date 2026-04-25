const Stripe = require("stripe");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { email, name, address, city, state, zip, amount } = req.body;

    if (!email || !name || !address || !city || !state || !zip) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount || 1000,
      currency: "usd",
      receipt_email: email,
      automatic_payment_methods: {
        enabled: true
      },
      metadata: {
        customer_name: name,
        billing_address: address,
        city: city,
        state: state,
        zip: zip
      }
    });

    return res.status(200).json({
      clientSecret: paymentIntent.client_secret
    });

  } catch (error) {
    return res.status(500).json({
      error: error.message
    });
  }
};
