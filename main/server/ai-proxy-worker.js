/* ==========================================================
   AI PROXY for the portfolio chatbot — Cloudflare Worker
   Keeps your API key secret on the server.

   Setup (free Cloudflare account):
   1. Workers & Pages → Create → Worker → paste this file.
   2. Settings → Variables → add a SECRET named ANTHROPIC_API_KEY.
   3. (Optional) add a variable ALLOWED_ORIGIN = https://YOUR-USERNAME.github.io
   4. Deploy, then copy the worker URL into aiEndpoint in site-config.js.
   ========================================================== */
const MODEL = "claude-sonnet-5-5"; // change if you prefer another model

const SYSTEM = `You are the friendly portfolio assistant for Shane Vincent Olavario,
a first-year Computer Engineering student. Answer questions about him, his skills
(HTML, CSS, JavaScript, Python, Git/GitHub, databases), his projects (Student Management
System, Workout Planner, Health Monitoring System, Grade Calculator, Scientific Calculator,
Book Management System, SysVision), and explain programming basics clearly for beginners.
Keep answers under 120 words. If you don't know something about Vincent, say so honestly
and suggest the Contact page. Never invent facts. Decline unrelated or harmful requests politely.`;

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";
    const allowed = env.ALLOWED_ORIGIN || "*";
    const cors = {
      "Access-Control-Allow-Origin": allowed === "*" ? "*" : allowed,
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };
    if (request.method === "OPTIONS") return new Response(null, { headers: cors });
    if (request.method !== "POST") return new Response("Method not allowed", { status: 405, headers: cors });
    if (allowed !== "*" && origin !== allowed) return new Response("Forbidden", { status: 403, headers: cors });

    let body;
    try { body = await request.json(); } catch { return new Response("Bad request", { status: 400, headers: cors }); }

    const messages = (Array.isArray(body.messages) ? body.messages : [])
      .slice(-10)
      .filter((m) => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
      .map((m) => ({ role: m.role, content: m.content.slice(0, 1000) }));
    if (!messages.length || messages[messages.length - 1].role !== "user") {
      return new Response("Bad request", { status: 400, headers: cors });
    }

    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({ model: MODEL, max_tokens: 400, system: SYSTEM, messages }),
    });
    if (!res.ok) return new Response("Upstream error", { status: 502, headers: cors });
    const data = await res.json();
    const reply = (data.content || []).filter((b) => b.type === "text").map((b) => b.text).join("\n");
    return new Response(JSON.stringify({ reply }), { headers: { ...cors, "Content-Type": "application/json" } });
  },
};
