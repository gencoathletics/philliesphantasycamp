function loadCSV(url, tableId, defaultSortColumn = 0) {
  fetch(url)
    .then(response => response.text())
    .then(data => {
      const rows = data.trim().split("\n").map(r => r.split(","));
      const headers = rows.shift();

      // Build table header
      const thead = `<thead><tr>${headers.map(h => `<th>${h}</th>`).join("")}</tr></thead>`;

      // Build table body
      const tbody = `<tbody>${rows
        .map(r => `<tr>${r.map(c => `<td>${c}</td>`).join("")}</tr>`)
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

// Load career hitting (sort by Career_AB)
loadCSV("data/hittingcareer_normalized.csv", "careerHitting", 3);

// Load career pitching (sort by Career_IP)
loadCSV("data/pitchingcareer_normalized.csv", "careerPitching", 3);
