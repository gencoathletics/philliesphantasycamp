function loadCSV(url, tableId, defaultSortColumn = 0) {
  fetch(url)
    .then(response => response.text())
    .then(data => {
      const rows = data.trim().split("\n").map(r => r.split(","));
      const headers = rows.shift();  // first row = header

      // Modify headers: rename FIRST NAME → PLAYER
      const displayHeaders = [...headers];
      displayHeaders[1] = "PLAYER";   // rename FIRST NAME
      // LAST NAME (index 2) will be hidden via DataTables

      // Build table header
      const thead = `<thead><tr>${displayHeaders.map(h => `<th>${h}</th>`).join("")}</tr></thead>`;

      // Build table body
      const tbody = `<tbody>${rows
        .map(r => {
          const playerID = r[0];
          const first = r[1];
          const last = r[2];

          // Create clickable full name
          const nameLink = `<a href="players/player.html?id=${playerID}">${first} ${last}</a>`;

          // Build a new row with EXACT column count
          const newRow = [...r];
          newRow[1] = nameLink;  // FIRST NAME becomes full clickable name
          newRow[2] = last;      // LAST NAME stays in data but will be hidden

