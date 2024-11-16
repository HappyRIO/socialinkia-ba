const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../../model/User");
const connectDB = require("../../data/db");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// Check if session token is valid
const isSessionValid = (req, res, next) => {
  connectDB();
  console.log("Validating session");
  const { sessionToken } = req.cookies;

  if (!sessionToken) {
    console.log("no session token");
    return res.status(401).json({ error: "No session token provided." });
  }

  User.findOne({ sessionToken })
    .then((user) => {
      if (!user) {
        console.log({ error: "Invalid session token." });
        return res.status(401).json({ error: "Invalid session token." });
      }

      const expirationTime = new Date(user.sessionExpiresAt);
      const currentTime = new Date();
      const timeDifference = expirationTime - currentTime;

      if (timeDifference <= 0) {
        return res.status(401).json({ error: "Session expired." });
      }

      req.user = user;
      next();
    })
    .catch((error) => {
      console.error("Error checking session validity:", error);
      res.status(500).json({ error: "Server error" });
    });
};

// Subscription plans (prices in cents)
const subscriptionPlans = {
  monthly: { basic: 10000, standard: 25000, premium: 30000 },
  yearly: 300000,
  payAsYouGo: 1000, // $10 per hour
};

// Route to create a payment intent for one-time payments
router.post("/create-payment-intent", async (req, res) => {
  const { amount, currency } = req.body;
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      automatic_payment_methods: { enabled: true },
    });
    res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error("Error creating payment intent:", error);
    res.status(500).json({ error: "Failed to create payment intent" });
  }
});

// Route to create a subscription with a 1-week free trial
// router.post("/create-subscription", isSessionValid, async (req, res) => {
//   const { plan, cardDetails } = req.body;
//   const price = subscriptionPlans.monthly[plan];

//   try {
//     const paymentMethod = await stripe.paymentMethods.create({
//       type: "card",
//       card: {
//         number: cardDetails.cardNumber,
//         exp_month: cardDetails.expiryMonth,
//         exp_year: cardDetails.expiryYear,
//         cvc: cardDetails.cvc,
//       },
//     });

//     const customer = await stripe.customers.create({
//       payment_method: paymentMethod.id,
//       email: req.user.email,
//       invoice_settings: { default_payment_method: paymentMethod.id },
//     });

//     const subscription = await stripe.subscriptions.create({
//       customer: customer.id,
//       items: [
//         {
//           price_data: {
//             currency: "usd",
//             recurring: { interval: "month" },
//             unit_amount: price,
//           },
//         },
//       ],
//       trial_period_days: 7,
//       expand: ["latest_invoice.payment_intent"],
//     });

//     const user = await User.findById(req.user._id);
//     user.subscription = {
//       id: subscription.id,
//       active: true,
//       plan,
//     };
//     await user.save();

//     res.status(200).json({ subscriptionDetails: user.subscription });
//   } catch (error) {
//     console.error("Error creating subscription:", error);
//     res.status(500).json({ error: "Failed to create subscription" });
//   }
// });

// Route to create a subscription with a 1-week free trial
router.post("/create-subscription", isSessionValid, async (req, res) => {
  const { plan, cardDetails } = req.body;
  const price = subscriptionPlans.monthly[plan];

  try {
    const paymentMethod = await stripe.paymentMethods.create({
      type: "card",
      card: {
        number: cardDetails.cardNumber,
        exp_month: cardDetails.expiryMonth,
        exp_year: cardDetails.expiryYear,
        cvc: cardDetails.cvc,
      },
    });

    const customer = await stripe.customers.create({
      payment_method: paymentMethod.id,
      email: req.user.email,
      invoice_settings: { default_payment_method: paymentMethod.id },
    });

    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [
        {
          price_data: {
            currency: "usd",
            recurring: { interval: "month" },
            unit_amount: price,
          },
        },
      ],
      trial_period_days: 5,
      expand: ["latest_invoice.payment_intent"],
    });

    const user = await User.findById(req.user._id);
    user.subscription = {
      id: subscription.id,
      active: true,
      plan,
      amount: price,
      currency: "usd",
      trialEnd: new Date(subscription.trial_end * 1000), // Convert from timestamp
      renewalDate: new Date(subscription.current_period_end * 1000),
    };

    // Add the first payment to payment history
    user.subscription.paymentHistory.push({
      amount: price,
      currency: "usd",
      status: "succeeded", // Assuming the payment is successful
      date: new Date(),
    });

    await user.save();

    res.status(200).json({ subscriptionDetails: user.subscription });
  } catch (error) {
    console.error("Error creating subscription:", error);
    res.status(500).json({ error: "Failed to create subscription" });
  }
});

// Route to cancel a subscription
router.post("/cancel-subscription", isSessionValid, async (req, res) => {
  const { subscriptionId } = req.body;
  try {
    await stripe.subscriptions.del(subscriptionId);

    // Update user's subscription status in the database
    const user = await User.findById(req.user._id);
    if (user && user.subscription.id === subscriptionId) {
      user.subscription.active = false;
      user.subscription.status = "Cancelled";
      await user.save();
    }

    res.status(200).json({ message: "Subscription canceled successfully" });
  } catch (error) {
    console.error("Error canceling subscription:", error);
    res.status(500).json({ error: "Failed to cancel subscription" });
  }
});

// Route to check subscription status
router.get("/subscription-status", isSessionValid, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user || !user.subscription.id) {
      return res.status(404).json({ error: "No subscription found for user" });
    }
    const subscription = await stripe.subscriptions.retrieve(
      user.subscription.id
    );
    const isActive =
      subscription.status === "active" || subscription.status === "trialing";

    res.status(200).json({
      isSubscribed: isActive,
      subscriptionStatus: subscription.status,
      trialEnd: subscription.trial_end
        ? new Date(subscription.trial_end * 1000)
        : null,
      renewalDate: subscription.current_period_end
        ? new Date(subscription.current_period_end * 1000)
        : null,
    });
  } catch (error) {
    console.error("Error checking subscription status:", error);
    res.status(500).json({ error: "Failed to retrieve subscription status" });
  }
});

// Route to retrieve user subscription details
router.get("/details", isSessionValid, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Ensure subscription object exists, or set defaults if it's missing
    const { subscription = {} } = user;

    const subscriptionDetails = {
      plan: subscription.plan || "No plan",
      status: subscription.active ? "Active" : "Inactive",
      amount: subscription.amount
        ? `$${(subscription.amount / 100).toFixed(2)}`
        : "0.00",
      trialEnd: subscription.trialEnd || null,
      renewalDate: subscription.renewalDate || null,
      subscriptionId: subscription.id || null,
    };

    res.status(200).json(subscriptionDetails);
  } catch (error) {
    console.error("Error retrieving user details:", error);
    res.status(500).json({ error: "Failed to retrieve user details" });
  }
});

// Route to retrieve subscription and payment history
router.get("/subscription-history", isSessionValid, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("subscription"); // Populating the subscription field
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if the user has a subscription
    const subscription = user.subscription;
    if (!subscription) {
      return res.status(404).json({ error: "No subscription found for user" });
    }

    // Prepare subscription history response
    const subscriptionHistory = {
      plan: subscription.plan || "No plan",
      status: subscription.active ? "Active" : "Inactive",
      amount: subscription.amount
        ? `$${(subscription.amount / 100).toFixed(2)}`
        : "0.00",
      trialEnd: subscription.trialEnd || null,
      renewalDate: subscription.renewalDate || null,
      paymentHistory: subscription.paymentHistory || [], // Return payment history
    };

    res.status(200).json(subscriptionHistory);
  } catch (error) {
    console.error("Error retrieving subscription history:", error);
    res.status(500).json({ error: "Failed to retrieve subscription history" });
  }
});

// Stripe webhook to handle successful payments (e.g., invoice.payment_succeeded)
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event for successful payment
    if (event.type === "invoice.payment_succeeded") {
      const invoice = event.data.object;

      // Find the subscription from the invoice
      const user = await User.findOne({
        "subscription.id": invoice.subscription,
      });
      if (user) {
        // Add payment to the payment history
        user.subscription.paymentHistory.push({
          amount: invoice.amount_paid,
          currency: invoice.currency,
          status: "succeeded",
          date: new Date(invoice.created * 1000),
        });

        await user.save();
      }
    }

    res.status(200).send("Event received");
  }
);

module.exports = router;
