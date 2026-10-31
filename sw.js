const CACHE = "samiwater-tech-v1";
const CORE = ["/tech.html", "/login.html", "/logoasli.png", "/manifest.json"];
const OFFLINE_PAGE = "/tech.html";

self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(c => Promise.allSettled(CORE.map(u => c.add(u))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k.startsWith("samiwater-tech-") && k !== CACHE).map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

async function networkFirst(req) {
  const cache = await caches.open(CACHE);
  try {
    const res = await fetch(req);
    if (res && res.ok && !res.redirected) cache.put(req, res.clone());
    return res;
  } catch (err) {
    return (await cache.match(req))
      || (await cache.match(OFFLINE_PAGE))
      || new Response("آفلاین هستید و این صفحه ذخیره نشده است.", {
        status: 503,
        headers: { "Content-Type": "text/plain; charset=utf-8" }
      });
  }
}

async function staleWhileRevalidate(e) {
  const cache = await caches.open(CACHE);
  const cached = await cache.match(e.request);
  const fresh = fetch(e.request)
    .then(res => { if (res && res.ok) cache.put(e.request, res.clone()); return res; })
    .catch(() => null);
  e.waitUntil(fresh);
  return cached || (await fresh) || new Response("", { status: 504 });
}

self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  // درخواست‌های API و سایت‌های دیگر هرگز کش نمیشن (اطلاعات مالی و خصوصی)
  if (url.origin !== self.location.origin) return;
  if (req.mode === "navigate") { e.respondWith(networkFirst(req)); return; }
  if (CORE.includes(url.pathname)) e.respondWith(staleWhileRevalidate(e));
});

self.addEventListener("push", e => {
  let data = {};
  try { data = e.data ? e.data.json() : {}; }
  catch (_) { data = { body: e.data ? e.data.text() : "" }; }
  const options = {
    body: data.body || "کار یا تیکت جدید دارید",
    icon: "/logoasli.png",
    badge: "/logoasli.png",
    tag: data.tag || "samiwater-new-job",
    renotify: true,
    requireInteraction: true,
    vibrate: [300, 150, 300, 150, 600],
    dir: "rtl",
    lang: "fa",
    data: { url: data.url || "/tech.html", type: data.type || "job" }
  };
  e.waitUntil((async () => {
    await self.registration.showNotification(data.title || "سامی‌واتر", options);
    const list = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
    list.forEach(c => c.postMessage({ type: "PLAY_ALERT", kind: options.data.type }));
  })());
});

self.addEventListener("notificationclick", e => {
  e.notification.close();
  let target = new URL("/tech.html", self.location.origin);
  try {
    const u = new URL((e.notification.data && e.notification.data.url) || "/tech.html", self.location.origin);
    if (u.origin === self.location.origin) target = u;
  } catch (_) {}
  e.waitUntil((async () => {
    const list = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
    for (const c of list) {
      if (new URL(c.url).origin === self.location.origin && "focus" in c) return c.focus();
    }
    return self.clients.openWindow(target.href);
  })());
});
