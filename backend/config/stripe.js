const Stripe = require("stripe");

let stripe = null;

function getStripe() {
  if (!process.env.STRIPE_SECRET_KEY) {
    return null;
  }
  if (!stripe) {
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  }
  return stripe;
}

function isStripeConfigured() {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}

function frontendBase() {
  return (process.env.FRONTEND_URL || "http://localhost:5173").replace(/\/$/, "");
}

const PLAN_CATALOG = {
  starter: {
    name: "Starter",
    mode: "payment",
    amountInr: 999,
    description: "AdMax Starter — 1 campaign package",
    envPriceKey: "STRIPE_PRICE_STARTER",
  },
  business: {
    name: "Business",
    mode: "subscription",
    amountInr: 3499,
    description: "AdMax Business — monthly subscription",
    envPriceKey: "STRIPE_PRICE_BUSINESS",
  },
};

module.exports = {
  getStripe,
  isStripeConfigured,
  frontendBase,
  PLAN_CATALOG,
};
