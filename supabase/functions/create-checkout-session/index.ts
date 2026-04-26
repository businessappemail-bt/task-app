import Stripe from "https://esm.sh/stripe@14.21.0?target=deno";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
  apiVersion: "2023-10-16",
});

Deno.serve(async (req) => {
  try {
    const { title, budget } = await req.json();

    const amount = Math.round(Number(budget) * 100);

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: title || "TaskMint Task",
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      success_url: "https://YOUR-WEBSITE-LINK/post-job.html?payment=success",
      cancel_url: "https://YOUR-WEBSITE-LINK/post-job.html?payment=cancel",
    });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
