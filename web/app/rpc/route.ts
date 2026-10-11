const upstream = process.env.ANVIL_UPSTREAM || "http://127.0.0.1:8545";

type RpcCall = { jsonrpc?: string; id?: unknown; method?: unknown };

const DENIED = new Set([
  "eth_accounts",
  "eth_sendTransaction",
  "eth_sign",
  "eth_signTransaction",
  "eth_signTypedData",
  "eth_signTypedData_v3",
  "eth_signTypedData_v4",
]);

function allowed(method: unknown): boolean {
  if (typeof method !== "string") return false;
  if (DENIED.has(method)) return false;
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

  const nodeCalls = calls.filter((call) => !call || typeof call !== "object" || (call as RpcCall).method !== "eth_accounts");
  for (const call of nodeCalls) {
    if (!call || typeof call !== "object" || !allowed((call as RpcCall).method)) {
      const answer = Array.isArray(body) ? calls.map((item) => rejected((item ?? {}) as RpcCall)) : rejected((call ?? {}) as RpcCall);
      return Response.json(answer, { status: 403 });
    }
  }

  if (nodeCalls.length === 0) {
    const answer = calls.map((call) => ({ jsonrpc: "2.0", id: (call as RpcCall).id ?? null, result: [] }));
    return Response.json(Array.isArray(body) ? answer : answer[0]);
  }

  const upstreamResponse = await fetch(upstream, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: nodeCalls.length === calls.length ? text : JSON.stringify(nodeCalls),
  });
  const payload = await upstreamResponse.text();
  if (nodeCalls.length === calls.length) {
    return new Response(payload, {
      status: upstreamResponse.status,
      headers: { "content-type": "application/json" },
    });
  }

  let upstreamJson: unknown;
  try {
    upstreamJson = JSON.parse(payload);
  } catch {
    return new Response(payload, {
      status: upstreamResponse.status,
      headers: { "content-type": "application/json" },
    });
  }
  const upstreamList = Array.isArray(upstreamJson) ? upstreamJson : [upstreamJson];
  let index = 0;
  const merged = calls.map((call) => {
    if (call && typeof call === "object" && (call as RpcCall).method === "eth_accounts") {
      return { jsonrpc: "2.0", id: (call as RpcCall).id ?? null, result: [] };
    }
    const item = upstreamList[index];
    index += 1;
    return item;
  });
  return Response.json(Array.isArray(body) ? merged : merged[0]);
}
