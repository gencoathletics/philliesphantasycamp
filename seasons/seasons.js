// Detect season from URL (e.g., "2026.html" → "2026")
const season = window.location.pathname.split("/").pop().replace(".html", "");

// Load CSV helper
function loadCSV(url, callback) {
  fetch(url)
    .then(r => r.text())
    .then(text => {
      const rows = text.trim().split("\n").map(r => r.split(","));
      const headers = rows.shift();
      callback(headers, rows);
    });
}

// Build a table
function buildTable(headers, rows, tableId, defaultSortColumn = 0) {
  const thead = `<thead><tr>${headers.map(h => `<th>${h}</th>`).join("")}</tr></thead>`;
  const tbody = `<tbody>${rows
    .map(r => `<tr>${r.map(c => `<td>${c}</td>`).join("")}</tr>`)
    .join("")}</tbody>`;

  document.getElementById(tableId).innerHTML = thead + tbody;

  new DataTable(`#${tableId}`, {
    paging: true,
    searching: true,
    order: [[defaultSortColumn, "desc"]],
  });
}

// Load hitting for this season
loadCSV("../data/hitting_normalized.csv", (headers, rows) => {
  const filtered = rows.filter(r => r[3] === season); // Season column index
  buildTable(headers, filtered, "seasonHitting", 4);  // Sort by AB or H
});

// Load pitching for this season
loadCSV("../data/pitching_normalized.csv", (headers, rows) => {
  const filtered = rows.filter(r => r[3] === season); // Season column index
  buildTable(headers, filtered, "seasonPitching", 4); // Sort by IP or ERA
});
