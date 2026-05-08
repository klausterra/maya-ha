const BRAND = {
  name: "Maya Home",
  base: "/maya-home-rebrand",
};

function href(p) {
  return `${BRAND.base}/${p}?v=1`;
}

function upsertLink(rel, hrefValue, extra = {}) {
  let el = document.head.querySelector(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", hrefValue);
  for (const [k, v] of Object.entries(extra)) el.setAttribute(k, v);
  return el;
}

function setFavicon() {
  document.head
    .querySelectorAll('link[rel="icon"], link[rel="shortcut icon"], link[rel="apple-touch-icon"]')
    .forEach((n) => n.remove());

  upsertLink("icon", href("favicon-32.png"), { type: "image/png", sizes: "32x32" });
  upsertLink("shortcut icon", href("favicon.ico"), { type: "image/x-icon" });

  const apple = document.createElement("link");
  apple.setAttribute("rel", "apple-touch-icon");
  apple.setAttribute("href", href("icon-512.png"));
  document.head.appendChild(apple);
}

function setManifest() {
  upsertLink("manifest", href("manifest.webmanifest"));
}

function setTitle() {
  document.title = BRAND.name;
}

function injectCss(cssText, id = "maya-home-rebrand-style") {
  let style = document.getElementById(id);
  if (!style) {
    style = document.createElement("style");
    style.id = id;
    document.head.appendChild(style);
  }
  style.textContent = cssText;
}

function applyGlobalBrandingCss() {
  injectCss(`
    .maya-brand-logo {
      width: 32px;
      height: 32px;
      border-radius: 8px;
      background: url("${href("icon-512.png")}") center/contain no-repeat;
      display: inline-block;
    }

    /* Login: best-effort para esconder logo padrão */
    ha-auth-flow ha-icon,
    ha-auth-flow img[alt*="Home Assistant"],
    ha-auth-flow [class*="logo"] {
      display: none !important;
    }
  `);
}

function tryReplaceLoginLogo() {
  const auth = document.querySelector("ha-auth-flow");
  if (!auth) return false;

  const root = auth.shadowRoot || auth;
  const card =
    root.querySelector("ha-card") ||
    root.querySelector(".card") ||
    root.querySelector('[class*="container"]') ||
    auth;

  if (!card) return false;

  if (!root.querySelector("#maya-login-brand")) {
    const wrap = document.createElement("div");
    wrap.id = "maya-login-brand";
    wrap.style.display = "flex";
    wrap.style.flexDirection = "column";
    wrap.style.alignItems = "center";
    wrap.style.gap = "10px";
    wrap.style.padding = "18px 0 8px";

    const img = document.createElement("img");
    img.src = href("icon-512.png");
    img.alt = BRAND.name;
    img.style.width = "84px";
    img.style.height = "84px";
    img.style.objectFit = "contain";

    const title = document.createElement("div");
    title.textContent = BRAND.name;
    title.style.fontSize = "20px";
    title.style.fontWeight = "700";

    wrap.appendChild(img);
    wrap.appendChild(title);

    card.prepend(wrap);
  }

  return true;
}

function tryReplaceSidebarLogo() {
  const sidebar = document.querySelector("ha-sidebar");
  if (!sidebar) return false;

  const root = sidebar.shadowRoot || sidebar;
  const candidates = [
    root.querySelector('ha-icon[icon="hass:home-assistant"]'),
    root.querySelector('ha-icon[icon="hass:home-assistant-outline"]'),
    root.querySelector('a[href="/"] ha-icon'),
  ].filter(Boolean);

  const target = candidates[0];
  if (!target) return false;

  if (!root.querySelector(".maya-brand-logo")) {
    const span = document.createElement("span");
    span.className = "maya-brand-logo";
    target.replaceWith(span);
  }
  return true;
}

function runOnce() {
  setTitle();
  setFavicon();
  setManifest();
  applyGlobalBrandingCss();
  tryReplaceSidebarLogo();
  tryReplaceLoginLogo();
}

runOnce();
let tries = 0;
const timer = setInterval(() => {
  runOnce();
  tries += 1;
  if (tries >= 20) clearInterval(timer);
}, 1000);

