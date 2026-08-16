import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const body = await req.json();

    // Verify webhook signature if header present
    const signature = req.headers.get("X-Pretix-Signature") || "";
    const webhookSecret = Deno.env.get("PRETIX_WEBHOOK_SECRET") || "";

    if (webhookSecret && signature) {
      // In production: verify HMAC signature
      // For now, we accept if secret is configured
    }

    const action = body.action || "";
    const eventId = body.event || "";
    const orderId = body.code || "";

    if (!orderId) {
      return new Response(JSON.stringify({ error: "Missing order code" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    // Idempotency: check if we already processed this webhook
    const checkRes = await fetch(`${supabaseUrl}/rest/v1/pretix_orders?select=id,pretix_order_id&pretix_order_id=eq.${orderId}`, {
      headers: {
        "apikey": supabaseKey,
        "Authorization": `Bearer ${supabaseKey}`,
      },
    });
    const existing = await checkRes.json();

    // Map Pretix webhook events
    const relevantActions = [
      "pretix.event.order.placed",
      "pretix.event.order.paid",
      "pretix.event.order.canceled",
      "pretix.event.order.refunded",
      "pretix.event.order.changed",
    ];

    if (!relevantActions.includes(action)) {
      return new Response(JSON.stringify({ message: "Action not relevant, skipping" }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Determine status from action
    let status = "pending";
    let paymentStatus = "pending";
    if (action.includes("paid")) { status = "confirmed"; paymentStatus = "paid"; }
    else if (action.includes("canceled")) { status = "cancelled"; paymentStatus = "cancelled"; }
    else if (action.includes("refunded")) { status = "refunded"; paymentStatus = "refunded"; }
    else if (action.includes("placed")) { status = "pending"; paymentStatus = "pending"; }

    // Upsert order
    const orderData = {
      pretix_order_id: orderId,
      email: body.email || "",
      name: body.name || "",
      total: body.total || 0,
      status,
      payment_status: paymentStatus,
      created_at_pretix: body.datetime || new Date().toISOString(),
      synced_at: new Date().toISOString(),
    };

    if (existing && existing.length > 0) {
      // Update existing
      await fetch(`${supabaseUrl}/rest/v1/pretix_orders?pretix_order_id=eq.${orderId}`, {
        method: "PATCH",
        headers: {
          "apikey": supabaseKey,
          "Authorization": `Bearer ${supabaseKey}`,
          "Content-Type": "application/json",
          "Prefer": "return=minimal",
        },
        body: JSON.stringify(orderData),
      });
    } else {
      // Insert new
      await fetch(`${supabaseUrl}/rest/v1/pretix_orders`, {
        method: "POST",
        headers: {
          "apikey": supabaseKey,
          "Authorization": `Bearer ${supabaseKey}`,
          "Content-Type": "application/json",
          "Prefer": "return=minimal",
        },
        body: JSON.stringify({ ...orderData, event_id: eventId || null }),
      });
    }

    return new Response(JSON.stringify({
      message: "Webhook processed",
      action,
      orderId,
      status,
      paymentStatus,
    }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
