const db = require("../config/db");
const { getStripe, isStripeConfigured, frontendBase, PLAN_CATALOG } = require("../config/stripe");

async function getUserRow(userId) {
  const [rows] = await db.query("SELECT * FROM users WHERE id = ?", [userId]);
  return rows[0] || null;
}

async function ensureStripeCustomer(user) {
  const stripe = getStripe();
  if (!stripe) throw new Error("Stripe is not configured");

  if (user.stripe_customer_id) {
    return user.stripe_customer_id;
  }

  const customer = await stripe.customers.create({
    email: user.email,
    name: user.name || undefined,
    metadata: { userId: String(user.id) },
  });

  await db.query("UPDATE users SET stripe_customer_id = ? WHERE id = ?", [customer.id, user.id]);

  return customer.id;
}

exports.getStripeConfig = (_req, res) => {
  return res.json({
    configured: isStripeConfigured(),
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY || null,
    plans: {
      starter: Boolean(process.env.STRIPE_PRICE_STARTER) || true,
      business: Boolean(process.env.STRIPE_PRICE_BUSINESS) || true,
    },
  });
};

exports.createCheckoutSession = async (req, res) => {
  try {
    if (!isStripeConfigured()) {
      return res.status(503).json({
        message: "Stripe is not configured. Set STRIPE_SECRET_KEY in backend/.env",
      });
    }

    const stripe = getStripe();
    const user = await getUserRow(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const { plan, mode, amount, campaignId, campaign_id, successPath, cancelPath } = req.body;

    const campaignIdValue = campaignId || campaign_id || null;
    const customerId = await ensureStripeCustomer(user);
    const origin = frontendBase();

    let sessionMode = mode || "payment";
    let lineItems;
    let metadata = {
      userId: String(user.id),
      plan: plan || "custom",
    };
    if (campaignIdValue) metadata.campaignId = String(campaignIdValue);

    if (plan && PLAN_CATALOG[plan]) {
      const catalog = PLAN_CATALOG[plan];
      sessionMode = catalog.mode;
      const priceId = process.env[catalog.envPriceKey];

      if (priceId) {
        lineItems = [{ price: priceId, quantity: 1 }];
      } else if (sessionMode === "subscription") {
        lineItems = [
          {
            price_data: {
              currency: "inr",
              unit_amount: Math.round(catalog.amountInr * 100),
              recurring: { interval: "month" },
              product_data: {
                name: catalog.name,
                description: catalog.description,
              },
            },
            quantity: 1,
          },
        ];
      } else {
        lineItems = [
          {
            price_data: {
              currency: "inr",
              unit_amount: Math.round(catalog.amountInr * 100),
              product_data: {
                name: catalog.name,
                description: catalog.description,
              },
            },
            quantity: 1,
          },
        ];
      }
    } else {
      const payAmount = Number(amount);
      if (!payAmount || payAmount <= 0) {
        return res.status(400).json({ message: "Valid amount or plan is required" });
      }
      sessionMode = "payment";
      lineItems = [
        {
          price_data: {
            currency: "inr",
            unit_amount: Math.round(payAmount * 100),
            product_data: {
              name: "AdMax campaign payment",
              description: campaignIdValue ? `Campaign #${campaignIdValue}` : "Campaign checkout",
            },
          },
          quantity: 1,
        },
      ];
    }

    const session = await stripe.checkout.sessions.create({
      mode: sessionMode,
      customer: customerId,
      payment_method_types: ["card"],
      line_items: lineItems,
      success_url: `${origin}${successPath || "/payment-success"}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}${cancelPath || "/pricing"}`,
      client_reference_id: String(user.id),
      metadata,
      subscription_data:
        sessionMode === "subscription"
          ? { metadata: { userId: String(user.id), plan: plan || "business" } }
          : undefined,
    });

    const amountInr =
      sessionMode === "payment" && amount
        ? Number(amount)
        : plan && PLAN_CATALOG[plan]
          ? PLAN_CATALOG[plan].amountInr
          : Number(amount) || 0;

    await db.query(
      `INSERT INTO payments
        (user_id, campaign_id, order_id, amount, currency, status, provider, stripe_session_id)
       VALUES (?, ?, ?, ?, 'INR', 'created', 'stripe', ?)`,
      [user.id, campaignIdValue, session.id, amountInr || 0, session.id]
    );

    return res.json({
      url: session.url,
      sessionId: session.id,
      mode: sessionMode,
    });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    return res.status(500).json({
      message: error.message || "Failed to create Stripe checkout session",
    });
  }
};

exports.createPortalSession = async (req, res) => {
  try {
    if (!isStripeConfigured()) {
      return res.status(503).json({ message: "Stripe is not configured" });
    }

    const stripe = getStripe();
    const user = await getUserRow(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const customerId = await ensureStripeCustomer(user);
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${frontendBase()}/billing`,
    });

    return res.json({ url: session.url });
  } catch (error) {
    console.error("Stripe portal error:", error);
    return res.status(500).json({
      message: error.message || "Failed to open customer portal",
    });
  }
};

exports.getSubscription = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT plan_name, status, stripe_subscription_id, stripe_price_id,
              current_period_end, cancel_at_period_end, updated_at
       FROM subscriptions
       WHERE user_id = ?
       ORDER BY updated_at DESC
       LIMIT 1`,
      [req.user.id]
    );

    const user = await getUserRow(req.user.id);
    return res.json({
      subscription: rows[0] || null,
      stripeCustomerId: user?.stripe_customer_id || null,
      stripeConfigured: isStripeConfigured(),
    });
  } catch (error) {
    console.error("Get subscription error:", error);
    return res.status(500).json({ message: "Failed to fetch subscription" });
  }
};

exports.getCheckoutSession = async (req, res) => {
  try {
    if (!isStripeConfigured()) {
      return res.status(503).json({ message: "Stripe is not configured" });
    }

    const { sessionId } = req.params;
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (
      session.client_reference_id &&
      String(session.client_reference_id) !== String(req.user.id) &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Not allowed" });
    }

    return res.json({
      id: session.id,
      status: session.status,
      paymentStatus: session.payment_status,
      mode: session.mode,
      amountTotal: session.amount_total,
      currency: session.currency,
    });
  } catch (error) {
    console.error("Get checkout session error:", error);
    return res.status(500).json({ message: "Failed to fetch checkout session" });
  }
};

async function upsertSubscriptionFromStripe(subscription, userIdHint) {
  const userId = userIdHint || Number(subscription.metadata?.userId) || null;

  let resolvedUserId = userId;
  if (!resolvedUserId && subscription.customer) {
    const [users] = await db.query("SELECT id FROM users WHERE stripe_customer_id = ? LIMIT 1", [
      subscription.customer,
    ]);
    resolvedUserId = users[0]?.id || null;
  }

  if (!resolvedUserId) {
    console.warn("Stripe subscription with no matching user:", subscription.id);
    return;
  }

  const priceId = subscription.items?.data?.[0]?.price?.id || null;
  const planName =
    subscription.metadata?.plan ||
    (priceId && priceId === process.env.STRIPE_PRICE_BUSINESS ? "business" : "business");

  const periodEnd = subscription.current_period_end
    ? new Date(subscription.current_period_end * 1000)
    : null;

  const [existing] = await db.query(
    "SELECT id FROM subscriptions WHERE stripe_subscription_id = ? LIMIT 1",
    [subscription.id]
  );

  if (existing.length) {
    await db.query(
      `UPDATE subscriptions SET
        status = ?,
        stripe_price_id = ?,
        plan_name = ?,
        current_period_end = ?,
        cancel_at_period_end = ?
       WHERE stripe_subscription_id = ?`,
      [
        subscription.status,
        priceId,
        planName,
        periodEnd,
        subscription.cancel_at_period_end ? 1 : 0,
        subscription.id,
      ]
    );
  } else {
    await db.query(
      `INSERT INTO subscriptions
        (user_id, stripe_subscription_id, stripe_price_id, plan_name, status,
         current_period_end, cancel_at_period_end)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        resolvedUserId,
        subscription.id,
        priceId,
        planName,
        subscription.status,
        periodEnd,
        subscription.cancel_at_period_end ? 1 : 0,
      ]
    );
  }
}

exports.handleStripeWebhook = async (req, res) => {
  const stripe = getStripe();
  if (!stripe) {
    return res.status(503).send("Stripe not configured");
  }

  const signature = req.headers["stripe-signature"];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;
  try {
    if (webhookSecret) {
      event = stripe.webhooks.constructEvent(req.body, signature, webhookSecret);
    } else {
      // Dev fallback — prefer configuring STRIPE_WEBHOOK_SECRET
      event = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
      console.warn("⚠️  STRIPE_WEBHOOK_SECRET missing — webhook signature not verified");
    }
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        await db.query(
          `UPDATE payments SET
            status = 'paid',
            payment_id = COALESCE(?, payment_id),
            provider = 'stripe'
           WHERE stripe_session_id = ? OR order_id = ?`,
          [session.payment_intent || session.subscription || session.id, session.id, session.id]
        );

        if (session.mode === "subscription" && session.subscription) {
          const subscription = await stripe.subscriptions.retrieve(session.subscription);
          await upsertSubscriptionFromStripe(
            subscription,
            Number(session.metadata?.userId) || Number(session.client_reference_id)
          );
        }
        break;
      }
      case "customer.subscription.created":
      case "customer.subscription.updated": {
        await upsertSubscriptionFromStripe(event.data.object);
        break;
      }
      case "customer.subscription.deleted": {
        const sub = event.data.object;
        await db.query(
          `UPDATE subscriptions SET status = 'canceled', cancel_at_period_end = 0
           WHERE stripe_subscription_id = ?`,
          [sub.id]
        );
        break;
      }
      case "invoice.payment_failed": {
        const invoice = event.data.object;
        if (invoice.subscription) {
          await db.query(
            `UPDATE subscriptions SET status = 'past_due'
             WHERE stripe_subscription_id = ?`,
            [invoice.subscription]
          );
        }
        break;
      }
      default:
        break;
    }

    return res.json({ received: true });
  } catch (error) {
    console.error("Webhook handler error:", error);
    return res.status(500).json({ message: "Webhook handler failed" });
  }
};
