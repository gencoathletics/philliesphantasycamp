function loadCSV(url, tableId, defaultSortColumn = 0) {
  fetch(url)
    .then(response => response.text())
    .then(data => {
      const rows = data.trim().split("\n").map(r => r.split(","));
      const headers = rows.shift();

      // Build table header
      const thead = `<thead><tr>${headers.map(h => `<th>${h}</th>`).join("")}</tr></thead>`;

      // Build table body with clickable
