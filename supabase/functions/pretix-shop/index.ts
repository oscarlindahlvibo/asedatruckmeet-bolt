import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const PRETIX_API_BASE = Deno.env.get("PRETIX_API_BASE") ?? "";
const PRETIX_API_TOKEN = Deno.env.get("PRETIX_API_TOKEN") ?? "";
const PRETIX_ORGANIZER = Deno.env.get("PRETIX_ORGANIZER") ?? "";
const PRETIX_EVENT = Deno.env.get("PRETIX_EVENT") ?? "";
const PRETIX_SHOP_URL = Deno.env.get("PRETIX_SHOP_URL") ?? "https://asedatruckmeet.se/butik";

function isConfigured(): boolean {
  return Boolean(PRETIX_API_BASE && PRETIX_API_TOKEN && PRETIX_ORGANIZER && PRETIX_EVENT);
}

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

interface PretixItem {
  id: number;
  name: { [lang: string]: string };
  description: { [lang: string]: string } | null;
  default_price: string;
  active: boolean;
  category: number | null;
  available: boolean;
}

interface PretixCategory {
  id: number;
  name: { [lang: string]: string };
}

function pickLocalized(field: { [lang: string]: string } | null, fallback = ""): string {
  if (!field) return fallback;
  return field["sv"] ?? field["en"] ?? field["de"] ?? Object.values(field)[0] ?? fallback;
}

async function fetchItems(): Promise<Response> {
  if (!isConfigured()) {
    return json({ tickets: [], source: "mock", configured: false });
  }

  try {
    const headers: Record<string, string> = {
      Authorization: `Token ${PRETIX_API_TOKEN}`,
      Accept: "application/json",
    };

    const [itemsRes, categoriesRes] = await Promise.all([
      fetch(
        `${PRETIX_API_BASE}/api/v1/organizers/${PRETIX_ORGANIZER}/events/${PRETIX_EVENT}/items/`,
        { headers }
      ),
      fetch(
        `${PRETIX_API_BASE}/api/v1/organizers/${PRETIX_ORGANIZER}/events/${PRETIX_EVENT}/categories/`,
        { headers }
      ),
    ]);

    if (!itemsRes.ok) {
      return json({ error: `Pretix API error: ${itemsRes.status}` }, 502);
    }

    const itemsData = await itemsRes.json();
    const categoriesData: PretixCategory[] = categoriesRes.ok ? await categoriesRes.json() : [];

    const categoryMap = new Map<number, string>();
    for (const cat of categoriesData) {
      categoryMap.set(cat.id, pickLocalized(cat.name, "Övrigt"));
    }

    const tickets = (itemsData.results as PretixItem[])
      .filter((item) => item.active)
      .map((item) => ({
        id: item.id,
        name: pickLocalized(item.name, "Biljett"),
        description: pickLocalized(item.description, ""),
        price: item.default_price,
        category: item.category ? (categoryMap.get(item.category) ?? "Biljett") : "Biljett",
        available: item.available,
        badge: null as string | null,
      }));

    return json({ tickets, source: "pretix", configured: true });
  } catch (err) {
    return json(
      { error: err instanceof Error ? err.message : "Failed to fetch items" },
      502
    );
  }
}

interface CartRequest {
  items: { item: number; variation: number | null; count: number }[];
}

async function createCart(req: Request): Promise<Response> {
  if (!isConfigured()) {
    return json({
      checkoutUrl: PRETIX_SHOP_URL,
      cartId: "mock",
    });
  }

  try {
    const body: CartRequest = await req.json();
    if (!body.items || body.items.length === 0) {
      return json({ error: "No items in cart" }, 400);
    }

    const headers: Record<string, string> = {
      Authorization: `Token ${PRETIX_API_TOKEN}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    };

    // Step 1: Create a cart
    const cartLines = body.items.map((line) => ({
      item: line.item,
      variation: line.variation,
      count: line.count,
      answers: [],
    }));

    const cartRes = await fetch(
      `${PRETIX_API_BASE}/api/v1/organizers/${PRETIX_ORGANIZER}/events/${PRETIX_EVENT}/cartpositions/`,
      {
        method: "POST",
        headers,
        body: JSON.stringify({ positions: cartLines }),
      }
    );

    if (!cartRes.ok) {
      const errText = await cartRes.text().catch(() => "");
      return json({ error: `Cart creation failed: ${errText || cartRes.status}` }, 502);
    }

    const cartData = await cartRes.json();

    // Step 2: Generate checkout URL
    const checkoutRes = await fetch(
      `${PRETIX_API_BASE}/api/v1/organizers/${PRETIX_ORGANIZER}/events/${PRETIX_EVENT}/checkout/`,
      {
        method: "POST",
        headers,
        body: JSON.stringify({ cart: cartData.id }),
      }
    );

    if (!checkoutRes.ok) {
      // Fall back to the shop URL
      return json({ checkoutUrl: PRETIX_SHOP_URL, cartId: cartData.id });
    }

    const checkoutData = await checkoutRes.json();

    return json({
      checkoutUrl: checkoutData.url ?? PRETIX_SHOP_URL,
      cartId: cartData.id,
    });
  } catch (err) {
    return json(
      { error: err instanceof Error ? err.message : "Checkout failed" },
      502
    );
  }
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const action = url.searchParams.get("action");

    if (action === "items" && req.method === "GET") {
      return await fetchItems();
    }

    if (action === "cart" && req.method === "POST") {
      return await createCart(req);
    }

    return json({ error: "Unknown action" }, 404);
  } catch (err) {
    return json(
      { error: err instanceof Error ? err.message : "Internal error" },
      500
    );
  }
});
