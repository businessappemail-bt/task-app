const Stripe = require("stripe");

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

module.exports = async (req, res) => {

  res.setHeader(
    "Access-Control-Allow-Origin",
    "*"
  );

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
      email,
      stripeAccountId
    } = req.body;

    let accountId =
      stripeAccountId;

    if (!accountId) {

      const account =
        await stripe.accounts.create({
          type: "express",
          country: "US",
          email: email,
          capabilities: {
            transfers: {
              requested: true
            }
          }
        });

      accountId =
        account.id;

    }

    const accountLink =
      await stripe.accountLinks.create({
        account: accountId,

        refresh_url:
          "https://task-app-mu-two.vercel.app/worker-payout-info.html",

        return_url:
          "https://task-app-mu-two.vercel.app/worker-payout-info.html",

        type: "account_onboarding"
      });

    return res.status(200).json({
      url: accountLink.url,
      stripeAccountId: accountId
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      error: error.message
    });

  }

};
