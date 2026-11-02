// BoxedIn website helpers (11-02-2026). Public keys only: the publishable key is meant to be in web pages.
window.BoxedIn = (function () {
  var API = "https://udgkfaexenahxysamgzo.supabase.co";
  var KEY = "sb_publishable_SCV7TKQT1joenEhpYZ-0-g_NEoaT091";

  function store(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; } }

  // Language: ?lang=es|en, then the visitor's last choice, then the phone's language.
  function pickLang() {
    var q = (new URLSearchParams(location.search).get("lang") || "").toLowerCase();
    if (q === "es" || q === "en") { store("boxedin-lang", q); return q; }
    var s = store("boxedin-lang");
    if (s === "es" || s === "en") return s;
    return /^es\b/i.test(navigator.language || "") ? "es" : "en";
  }
  function applyLang(lang) {
    document.documentElement.lang = lang;
    document.querySelectorAll("[data-lang]").forEach(function (el) { el.hidden = el.getAttribute("data-lang") !== lang; });
    document.querySelectorAll("[data-title-" + lang + "]").forEach(function (el) { document.title = el.getAttribute("data-title-" + lang); });
  }
  function initLang() {
    var lang = pickLang();
    applyLang(lang);
    document.querySelectorAll("[data-switch]").forEach(function (b) {
      b.addEventListener("click", function () { var l = b.getAttribute("data-switch"); store("boxedin-lang", l); applyLang(l); });
    });
    return lang;
  }

  // Real founder count from the database. Hidden if it can't load, so a wrong number never shows.
  function foundingSpots() {
    fetch(API + "/rest/v1/rpc/founding_status", { method: "POST", headers: { apikey: KEY, "Content-Type": "application/json" }, body: "{}" })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (rows) {
        var row = rows && rows[0];
        if (!row || typeof row.spots_left !== "number" || !row.is_open) return;
        document.getElementById("spots-n").textContent = row.spots_left;
        document.getElementById("spots").hidden = false;
      }).catch(function () {});
  }

  // "[X] waived setups left": real count from the database only; hidden if it can't load or X = 0.
  function waivedSetups() {
    fetch(API + "/rest/v1/rpc/setup_waiver_status", { method: "POST", headers: { apikey: KEY, "Content-Type": "application/json" }, body: "{}" })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (rows) {
        var row = Array.isArray(rows) ? rows[0] : rows;
        if (!row || typeof row.waivers_left !== "number" || row.waivers_left <= 0) return;
        document.getElementById("waivers-n").textContent = row.waivers_left;
        document.getElementById("waivers").hidden = false;
      }).catch(function () {});
  }

  return { API: API, KEY: KEY, initLang: initLang, applyLang: applyLang, foundingSpots: foundingSpots, waivedSetups: waivedSetups };
})();
