/* Asistente IA embebible de HarayaDev — add-on sobre el sitio que el cliente YA tiene.
 *
 * Instalación (una línea, en cualquier sitio: WordPress, Wix, HTML, VTEX):
 *   <script src="https://TU-APP.vercel.app/widget.js" data-tenant="ID-DEL-CLIENTE"></script>
 *
 * Opcionales: data-name="Mi Negocio"  data-color="#FF3D3D"
 * El endpoint se deriva del propio origen donde se sirve widget.js (nuestro deploy).
 */
(function () {
  "use strict";
  var script = document.currentScript;
  if (!script) return;

  var tenant = script.getAttribute("data-tenant");
  if (!tenant) {
    console.error("[HarayaDev widget] falta data-tenant en la etiqueta <script>.");
    return;
  }
  var name = script.getAttribute("data-name") || "Asistente";
  var color = script.getAttribute("data-color") || "#FF3D3D";
  var base = new URL(script.src).origin;
  var endpoint = base + "/api/embed/chat?t=" + encodeURIComponent(tenant);

  var messages = []; // {role:'user'|'assistant', content:string}
  var open = false;
  var busy = false;

  // --- estilos (aislados por prefijo hd-) ---
  var css =
    ".hd-w{position:fixed;right:16px;bottom:16px;z-index:2147483000;font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif}" +
    ".hd-btn{width:56px;height:56px;border:none;border-radius:50%;background:" + color + ";color:#fff;cursor:pointer;box-shadow:0 6px 20px rgba(0,0,0,.25);display:flex;align-items:center;justify-content:center}" +
    ".hd-btn svg{width:26px;height:26px}" +
    ".hd-panel{position:absolute;right:0;bottom:68px;width:330px;max-width:calc(100vw - 32px);height:460px;max-height:calc(100vh - 100px);background:#fff;border-radius:16px;box-shadow:0 12px 40px rgba(0,0,0,.28);display:none;flex-direction:column;overflow:hidden}" +
    ".hd-panel.hd-on{display:flex}" +
    ".hd-head{background:" + color + ";color:#fff;padding:12px 14px;font-weight:600;font-size:14px;display:flex;justify-content:space-between;align-items:center}" +
    ".hd-x{background:none;border:none;color:#fff;cursor:pointer;font-size:18px;line-height:1}" +
    ".hd-body{flex:1;overflow-y:auto;padding:12px;display:flex;flex-direction:column;gap:8px;background:#f7f7f8}" +
    ".hd-msg{max-width:85%;padding:8px 11px;border-radius:12px;font-size:14px;line-height:1.4;white-space:pre-wrap;word-wrap:break-word}" +
    ".hd-user{align-self:flex-end;background:" + color + ";color:#fff}" +
    ".hd-bot{align-self:flex-start;background:#fff;color:#111;border:1px solid rgba(0,0,0,.08)}" +
    ".hd-form{display:flex;gap:6px;padding:8px;border-top:1px solid rgba(0,0,0,.08);background:#fff}" +
    ".hd-in{flex:1;border:1px solid rgba(0,0,0,.15);border-radius:20px;padding:8px 12px;font-size:14px;outline:none}" +
    ".hd-in:focus{border-color:" + color + "}" +
    ".hd-send{border:none;background:" + color + ";color:#fff;border-radius:50%;width:36px;height:36px;cursor:pointer;flex:0 0 auto}" +
    ".hd-foot{font-size:10px;color:#999;text-align:center;padding:4px}" +
    ".hd-foot a{color:#999;text-decoration:none}";
  var style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);

  // --- DOM ---
  var wrap = document.createElement("div");
  wrap.className = "hd-w";
  wrap.innerHTML =
    '<div class="hd-panel" role="dialog" aria-label="Asistente virtual">' +
      '<div class="hd-head"><span>' + escapeHtml(name) + '</span><button class="hd-x" aria-label="Cerrar">✕</button></div>' +
      '<div class="hd-body"></div>' +
      '<form class="hd-form"><input class="hd-in" type="text" placeholder="Escribe tu mensaje…" aria-label="Mensaje" autocomplete="off"/>' +
        '<button class="hd-send" type="submit" aria-label="Enviar">→</button></form>' +
      '<div class="hd-foot"><a href="https://haraya.dev" target="_blank" rel="noopener">con IA por HarayaDev</a></div>' +
    '</div>' +
    '<button class="hd-btn" aria-label="Abrir asistente">' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>' +
    '</button>';
  document.body.appendChild(wrap);

  var panel = wrap.querySelector(".hd-panel");
  var body = wrap.querySelector(".hd-body");
  var form = wrap.querySelector(".hd-form");
  var input = wrap.querySelector(".hd-in");
  var toggle = wrap.querySelector(".hd-btn");
  var closeBtn = wrap.querySelector(".hd-x");

  toggle.addEventListener("click", function () {
    open = !open;
    panel.classList.toggle("hd-on", open);
    if (open) {
      if (body.childElementCount === 0) addBot("¡Hola! ¿En qué te puedo ayudar?");
      input.focus();
    }
  });
  closeBtn.addEventListener("click", function () {
    open = false;
    panel.classList.remove("hd-on");
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var text = input.value.trim();
    if (!text || busy) return;
    input.value = "";
    addUser(text);
    messages.push({ role: "user", content: text });
    send();
  });

  function send() {
    busy = true;
    var bot = addBot("…");
    fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: messages }),
    })
      .then(function (res) {
        if (!res.ok || !res.body) {
          return res.json().then(
            function (j) { throw new Error(j && j.error ? j.error : "Error"); },
            function () { throw new Error("Error"); }
          );
        }
        var reader = res.body.getReader();
        var dec = new TextDecoder();
        var acc = "";
        function pump() {
          return reader.read().then(function (r) {
            if (r.done) {
              messages.push({ role: "assistant", content: acc });
              busy = false;
              return;
            }
            acc += dec.decode(r.value, { stream: true });
            bot.textContent = acc;
            body.scrollTop = body.scrollHeight;
            return pump();
          });
        }
        return pump();
      })
      .catch(function (err) {
        bot.textContent = (err && err.message) || "No pudimos responder ahora. Escríbenos por WhatsApp.";
        busy = false;
      });
  }

  function addUser(t) { return addMsg(t, "hd-user"); }
  function addBot(t) { return addMsg(t, "hd-bot"); }
  function addMsg(t, cls) {
    var d = document.createElement("div");
    d.className = "hd-msg " + cls;
    d.textContent = t;
    body.appendChild(d);
    body.scrollTop = body.scrollHeight;
    return d;
  }
  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
})();
