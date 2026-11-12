/* ==========================================================
   SMARTER CHATBOT (optional)
   If SITE_CONFIG.aiEndpoint is set, typed questions go to your
   own AI proxy (see server/ai-proxy-worker.js). If it is empty,
   or the request fails, the built-in answers are used instead.
   No API key ever lives in this file.
   ========================================================== */
(function () {
  "use strict";

  const endpoint = (window.SITE_CONFIG && window.SITE_CONFIG.aiEndpoint) || "";
  const form = document.getElementById("chatbotForm");
  const input = document.getElementById("chatbotInput");
  const box = document.getElementById("chatbotMessages");
  if (!endpoint || !form || !input || !box) return;

  const footnote = document.querySelector(".chatbot-panel small, .chatbot-footer, .chatbot-note");
  if (footnote && /predefined/i.test(footnote.textContent)) {
    footnote.textContent = "Portfolio assistant · Powered by AI";
  }

  const history = [];

  function add(text, who) {
    const m = document.createElement("div");
    m.className = "chat-message " + who + "-message";
    m.textContent = text;
    box.appendChild(m);
    box.scrollTop = box.scrollHeight;
    return m;
  }

  // Capture phase: runs before the built-in handler in chatbot.js
  form.addEventListener(
    "submit",
    async (event) => {
      const text = input.value.trim();
      if (!text) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      input.value = "";
      add(text, "user");
      history.push({ role: "user", content: text });
      const pending = add("Thinking…", "bot");
      input.disabled = true;
      try {
        const ctrl = new AbortController();
        const timer = setTimeout(() => ctrl.abort(), 20000);
        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: history.slice(-10) }),
          signal: ctrl.signal,
        });
        clearTimeout(timer);
        if (!res.ok) throw new Error("bad status");
        const data = await res.json();
        const reply = String(data.reply || "").trim();
        if (!reply) throw new Error("empty");
        pending.textContent = reply.slice(0, 1500);
        history.push({ role: "assistant", content: reply });
      } catch (err) {
        pending.textContent =
          "I couldn't reach my AI brain just now, so try one of the quick questions below or ask again in a moment.";
      } finally {
        input.disabled = false;
        input.focus();
        box.scrollTop = box.scrollHeight;
      }
    },
    true
  );
})();
