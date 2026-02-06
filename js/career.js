function loadCSV(url, tableId, defaultSortColumn = 0) {
  fetch(url)
    .then(response => response.text())
    .then(data => {
      const rows = data.trim().split("\n").map(r => r.split(","));
      const headers = rows.shift();

      // Build table header
      const thead = `<thead><tr>${headers.map(h => `<th>${h}</th>`).join("")}</tr></thead>`;

      // Build table body with clickable names
      const tbody = `<tbody>${rows
        .map(r => {
          const playerID = r[0];
          const first = r[1];
          const last = r[2];

          // Create clickable name
          const nameLink = `<a href="players/player.html?id=${playerID}">${first} ${last}</a>`;

          // Replace FIRST NAME and LAST NAME columns with the link
          const newRow = [...r];
          newRow[1] = nameLink;   // FIRST NAME column
          newRow[2] = "";         // LAST NAME column (optional: leave blank)

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
