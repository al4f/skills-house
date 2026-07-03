(() => {
  const input = document.getElementById("search-input");
  const results = document.getElementById("search-results");
  let index = [];

  fetch("../data/search-index.json")
    .then((r) => r.json())
    .then((data) => { index = data; runSearch(); })
    .catch(() => { results.innerHTML = "<p>Could not load search index.</p>"; });

  const params = new URLSearchParams(location.search);
  if (params.get("q")) input.value = params.get("q");

  input.addEventListener("input", runSearch);

  function runSearch() {
    const q = input.value.trim().toLowerCase();
    if (!q) { results.innerHTML = ""; return; }
    const matches = index.filter((item) =>
      item.title.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q) ||
      (item.tags || []).some((t) => t.toLowerCase().includes(q))
    ).slice(0, 40);
    if (!matches.length) {
      results.innerHTML = "<p>No results.</p>";
      return;
    }
    results.innerHTML = matches.map((item) =>
      '<article class="search-hit"><span class="badge">' + item.type + '</span> ' +
      '<a href="../' + item.url + '"><strong>' + item.title + '</strong></a>' +
      '<p>' + item.description + '</p></article>'
    ).join("");
  }
})();