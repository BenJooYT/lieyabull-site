module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
  eleventyConfig.addFilter("year", () => new Date().getFullYear());
  eleventyConfig.addFilter("pad2", (n) => String(n).padStart(2, "0"));
  eleventyConfig.addFilter("slice", (arr, n) => (arr || []).slice(0, n));
  return {
    dir: { input: "src", includes: "_includes", layouts: "_layouts", data: "_data", output: "_site" },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk"
  };
}
