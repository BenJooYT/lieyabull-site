// Tiny progressive enhancement: ledger filtering. No-JS shows everything.
(function () {
  var search = document.querySelector("[data-filter-search]");
  var chips = Array.prototype.slice.call(document.querySelectorAll("[data-filter-chip]"));
  var items = Array.prototype.slice.call(document.querySelectorAll("[data-filter-item]"));
  if (!search && !chips.length) return;
  var activeTag = "";
  function apply() {
    var q = (search && search.value || "").trim().toLowerCase();
    items.forEach(function (el) {
      var hay = (el.getAttribute("data-filter-item") || "").toLowerCase();
      var okQ = !q || hay.indexOf(q) !== -1;
      var okT = !activeTag || hay.indexOf(activeTag.toLowerCase()) !== -1;
      el.hidden = !(okQ && okT);
    });
  }
  if (search) search.addEventListener("input", apply);
  chips.forEach(function (chip) {
    chip.addEventListener("click", function () {
      var next = chip.getAttribute("data-filter-chip");
      activeTag = (activeTag === next) ? "" : next;
      chips.forEach(function (c) { c.setAttribute("aria-pressed", c.getAttribute("data-filter-chip") === activeTag ? "true" : "false"); });
      apply();
    });
  });
})();

// Visit odometer (Abacus hit counter). Counts at most once per browser per
// 30min: fresh visitors HIT (increment + show), recent visitors GET (show only).
// Row stays hidden until a count loads; adblockers, offline, private-mode
// storage errors, or API failure fail silent, never an error.
(function () {
  var row = document.querySelector("[data-visits]");
  var el = document.querySelector("[data-visit-count]");
  if (!row || !el) return;
  var KEY = "lb-visit-ts";
  var WINDOW = 30 * 60 * 1000;
  var last = 0;
  try { last = +localStorage.getItem(KEY) || 0; } catch (e) {}
  var fresh = Date.now() - last > WINDOW;
  var endpoint = fresh ? "hit" : "get";
  fetch("https://abacus.jasoncameron.dev/" + endpoint + "/lieyabull-site/visits")
    .then(function (r) { if (!r.ok) throw new Error("bad status"); return r.json(); })
    .then(function (d) {
      if (typeof d.value !== "number") throw new Error("bad payload");
      el.textContent = d.value.toLocaleString("en-US");
      row.hidden = false;
      if (fresh) { try { localStorage.setItem(KEY, String(Date.now())); } catch (e) {} }
    })
    .catch(function () {});
})();

// Live version badges: entries carrying data-live-version fetch their own
// version.json (the same file their updater reads) and refresh the stamp +
// download button. Pinned HTML values stay as the fallback.
(function () {
  function verParts(v) {
    return String(v).replace(/^v/, "").split(/[.\-]/).map(function (x) {
      var n = parseInt(x, 10);
      return isNaN(n) ? -1 : n;
    });
  }
  function verGte(a, b) {
    a = verParts(a);
    b = verParts(b);
    for (var i = 0; i < Math.max(a.length, b.length); i++) {
      var x = a[i] || 0, y = b[i] || 0;
      if (x !== y) return x > y;
    }
    return true;
  }
  var stamps = document.querySelectorAll("[data-live-version]");
  Array.prototype.forEach.call(stamps, function (stamp) {
    var card = stamp.closest("article") || document;
    fetch(stamp.getAttribute("data-live-version"))
      .then(function (r) { if (!r.ok) throw new Error("bad status"); return r.json(); })
      .then(function (d) {
        if (!d || typeof d.versionName !== "string") throw new Error("bad payload");
        if (!verGte(d.versionName, stamp.textContent.trim())) return;
        stamp.textContent = "v" + d.versionName;
        var apk = card.querySelector("[data-live-apk]");
        if (apk && typeof d.downloadUrl === "string") {
          apk.setAttribute("href", d.downloadUrl);
          apk.textContent = "apk v" + d.versionName + " \u2197";
        }
      })
      .catch(function () {});
  });
})();
