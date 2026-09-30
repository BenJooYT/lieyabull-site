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

// Visit odometer (Abacus hit counter). Row stays hidden until a count
// loads; adblockers, offline, or API failure fail silent — never an error.
(function () {
  var row = document.querySelector("[data-visits]");
  var el = document.querySelector("[data-visit-count]");
  if (!row || !el) return;
  fetch("https://abacus.jasoncameron.dev/hit/lieyabull-site/visits")
    .then(function (r) { if (!r.ok) throw new Error("bad status"); return r.json(); })
    .then(function (d) {
      if (typeof d.value !== "number") throw new Error("bad payload");
      el.textContent = d.value.toLocaleString("en-US");
      row.hidden = false;
    })
    .catch(function () {});
})();
