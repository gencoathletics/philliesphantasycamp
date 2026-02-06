function loadCSV(url, tableId, defaultSortColumn = 0) {
  fetch(url)
    .then(response => response.text())
    .then(data => {
      const rows = data.trim().split("\n").map(r => r.split(","));
      const headers = rows.shift();  // first row = header

      // Build table header
      const thead = `<thead><tr>${headers.map(h => `<th>${h}</th>`).join("")}</tr></thead>`;

      // Build table body
      const tbody = `<tbody>${rows
        .map(r => {
          const playerID = r[0];
          const first = r[1];
          const last = r[2];

          // Create clickable name
          const nameLink = `<a href="players/player.html?id=${playerID}">${first} ${last}</a>`;

          // Build a new row with EXACT column count
          const newRow = [...r];
          newRow[1] = nameLink;  // FIRST NAME becomes link
          newRow[2] = last;      // LAST NAME stays visible

          return `<tr>${newRow.map(c => `<td>${c}</td>`).join("")}</tr>`;
        })
        .join("")}</tbody>`;

      document.getElementById(tableId).innerHTML = thead + tbody;

      // Activate DataTables
      new DataTable(`#${tableId}`, {
        paging: true,
        searching: true,
        order: [[defaultSortColumn, "desc"]],
      });
    });
}

// Load career hitting
loadCSV("data/hittingcareer_normalized.csv", "careerHitting", 3);

// Load career pitching
loadCSV("data/pitchingcareer_normalized.csv", "careerPitching", 3);
