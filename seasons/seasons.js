// =======================================
//  Extract season from the page filename
// =======================================
function getSeasonFromURL() {
  const file = window.location.pathname.split("/").pop();
  return file.replace(".html", ""); // "2026.html" → "2026"
}



// =======================================
//  Build a Season Table (Hitting or Pitching)
// =======================================
function loadSeasonCSV(url, tableId, defaultSortColumn = 0) {
  const season = getSeasonFromURL();

  fetch(url)
    .then(response => response.text())
    .then(data => {
      const rows = data.trim().split("\n").map(r => r.split(","));
      const headers = rows.shift(); // first row = header

      // Modify headers: rename FIRST NAME → PLAYER
      const displayHeaders = [...headers];
      displayHeaders[1] = "PLAYER"; // rename FIRST NAME
      // LAST NAME (index 2) will be hidden via DataTables

      // Filter rows for this season
      const filteredRows = rows.filter(r => r[3] === season);

      // Build table header
      const thead = `<thead><tr>${displayHeaders.map(h => `<th>${h}</th>`).join("")}</tr></thead>`;

      // Build table body
      const tbody = `<tbody>${filteredRows
        .map(r => {
          const playerID = r[0];
          const first = r[1];
          const last = r[2];

          // Create clickable full name
          const nameLink = `<a href="../players/player.html?id=${playerID}">${first} ${last}</a>`;

          // Build a new row with EXACT column count
          const newRow = [...r];
          newRow[1] = nameLink; // FIRST NAME becomes full clickable name
          newRow[2] = last;     // LAST NAME stays in data but will be hidden

          return `<tr>${newRow.map(c => `<td>${c}</td>`).join("")}</tr>`;
        })
        .join("")}</tbody>`;

      document.getElementById(tableId).innerHTML = thead + tbody;

      // Activate DataTables with hidden columns + custom sorting
      new DataTable(`#${tableId}`, {
        paging: true,
        searching: true,
        order: [[defaultSortColumn, "desc"]],

        columnDefs: [
          {
            // Hide PLAYER ID
            targets: 0,
            visible: false,
            searchable: false
          },
          {
            // Hide LAST NAME
            targets: 2,
            visible: false,
            searchable: false
          },
          {
            // PLAYER column sorting: sort by LAST NAME then FIRST NAME
            targets: 1,
            orderData: [2, 1]
          }
        ]
      });
    });
}



// =======================================
//  Load both Hitting + Pitching tables
// =======================================
function loadSeasonTables() {
  const season = getSeasonFromURL();

  // Hitting
  loadSeasonCSV(
    "../data/hitting_normalized.csv",
    "seasonHitting",
    4 // default sort column (e.g., Hits)
  );

  // Pitching
  loadSeasonCSV(
    "../data/pitching_normalized.csv",
    "seasonPitching",
    5 // default sort column (e.g., IP or ERA depending on your CSV)
  );
}
