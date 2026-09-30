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
