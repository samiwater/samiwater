const CACHE = "samiwater-club-v1";
const CORE = ["/club/", "/club/index.html", "/club/manifest.json", "/logoasli.png"];

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
      .then(keys => Promise.all(keys.filter(k => k.startsWith("samiwater-club-") && k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  // API و صفحه‌های دیگر (مثل فاکتور) هرگز کش نمی‌شوند
  if (url.origin !== self.location.origin) return;
  if (req.mode === "navigate" && url.pathname.startsWith("/club")) {
    e.respondWith(
      fetch(req).then(res => {
        if (res.ok) caches.open(CACHE).then(c => c.put(req, res.clone()));
        return res;
      }).catch(async () => (await caches.match(req)) || (await caches.match("/club/")) || new Response("آفلاین هستید.", { status: 503, headers: { "Content-Type": "text/plain; charset=utf-8" } }))
    );
    return;
  }
  if (CORE.includes(url.pathname)) {
    e.respondWith(
      caches.match(req).then(hit => {
        const net = fetch(req).then(res => { if (res.ok) caches.open(CACHE).then(c => c.put(req, res.clone())); return res; }).catch(() => hit);
        return hit || net;
      })
    );
  }
});

self.addEventListener("push", e => {
  let d = {};
  try { d = e.data ? e.data.json() : {}; } catch (_) { d = { body: e.data ? e.data.text() : "" }; }
  e.waitUntil(self.registration.showNotification(d.title || "سامی‌واتر", {
    body: d.body || "",
    icon: "/logoasli.png",
    badge: "/logoasli.png",
    dir: "rtl",
    lang: "fa",
    tag: d.tag || "samiwater-club",
    renotify: true,
    vibrate: [200, 100, 200],
    data: { url: d.url || "/club/" }
  }));
});

self.addEventListener("notificationclick", e => {
  e.notification.close();
  let target = new URL("/club/", self.location.origin);
  try {
    const u = new URL((e.notification.data && e.notification.data.url) || "/club/", self.location.origin);
    if (u.origin === self.location.origin) target = u;
  } catch (_) {}
  e.waitUntil((async () => {
    const list = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
    for (const c of list) {
      if (new URL(c.url).origin === self.location.origin && "focus" in c) {
        try { if ("navigate" in c) await c.navigate(target.href); } catch (_) {}
        return c.focus();
      }
    }
    return self.clients.openWindow(target.href);
  })());
});
