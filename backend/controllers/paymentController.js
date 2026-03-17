import Stripe from 'stripe';

const config = (req, res) =>
  res.send({
    stripePublishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
  });

const createPaymentIntent = async (req, res, next) => {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const { amount, currency } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount, 
      currency: currency || 'inr',
      automatic_payment_methods: {
        enabled: true,
      },
    });

    res.status(200).send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    next(error);
  }
};

export { config, createPaymentIntent };
