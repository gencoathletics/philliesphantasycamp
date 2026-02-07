// -------------------------------
// Normalize CSV keys (fixes BOM, spaces, casing)
// -------------------------------
function normalizeRow(row) {
    const clean = {};
    for (const key in row) {
        if (!key) continue;
        const newKey = key.trim().toUpperCase();
        clean[newKey] = row[key];
    }
    return clean;
}

// -------------------------------
// Get season from URL
// -------------------------------
function getSeasonFromURL() {
    const file = window.location.pathname.split("/").pop();
    return file.replace(".html", "");
}

// -------------------------------
// Load Hitting CSV
// -------------------------------
function loadSeasonHittingCSV(csvPath, tableId, season) {
    fetch(csvPath)
        .then(r => r.text())
        .then(text => {
            const parsed = Papa.parse(text, { header: true }).data;

            // Normalize every row
            const rows = parsed.map(normalizeRow);

            // Filter by season
            const filtered = rows.filter(r => r["SEASON"] == season);

            $(`#${tableId}`).DataTable({
                data: filtered,
                columns: [
                    { 
                        title: "Player",
                        data: null,
                        render: r => `${r["FIRST NAME"]} ${r["LAST NAME"]}`
                    },
                    { title: "AB", data: "AB" },
                    { title: "H", data: "H" },
                    { title: "R", data: "R" },
                    { title: "RBI", data: "RBI" },
                    { title: "2B", data: "2B" },
                    { title: "3B", data: "3B" },
                    { title: "HR", data: "HR" },
