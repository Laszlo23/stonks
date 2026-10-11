const upstream = process.env.ANVIL_UPSTREAM || "http://127.0.0.1:8545";

type RpcCall = { jsonrpc?: string; id?: unknown; method?: unknown };

function allowed(method: unknown): boolean {
  if (typeof method !== "string") return false;
  return method.startsWith("eth_") || method.startsWith("net_") || method.startsWith("web3_");
}

function rejected(call: RpcCall) {
  return { jsonrpc: "2.0", id: call.id ?? null, error: { code: -32601, message: "method not allowed" } };
}

export async function POST(request: Request) {
  const text = await request.text();
  if (text.length > 100_000) {
    return Response.json({ jsonrpc: "2.0", id: null, error: { code: -32600, message: "request too large" } }, { status: 413 });
  }

  let body: unknown;
  try {
    body = JSON.parse(text);
  } catch {
    return Response.json({ jsonrpc: "2.0", id: null, error: { code: -32700, message: "parse error" } }, { status: 400 });
  }

  const calls = Array.isArray(body) ? body : [body];
  if (calls.length === 0 || calls.length > 20) {
    return Response.json({ jsonrpc: "2.0", id: null, error: { code: -32600, message: "bad batch" } }, { status: 400 });
  }

  for (const call of calls) {
    if (!call || typeof call !== "object" || !allowed((call as RpcCall).method)) {
      const answer = Array.isArray(body) ? calls.map((item) => rejected((item ?? {}) as RpcCall)) : rejected((call ?? {}) as RpcCall);
      return Response.json(answer, { status: 403 });
    }
  }

  const upstreamResponse = await fetch(upstream, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: text,
  });
  const payload = await upstreamResponse.text();
  return new Response(payload, {
    status: upstreamResponse.status,
    headers: { "content-type": "application/json" },
  });
}
