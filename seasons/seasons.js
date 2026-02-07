// -------------------------------
// Get season from URL (e.g., 2026.html)
// -------------------------------
function getSeasonFromURL() {
    const file = window.location.pathname.split("/").pop();
    return file.replace(".html", "");
}

// -------------------------------
// Load Hitting CSV and filter by season
// -------------------------------
function loadSeasonHittingCSV(csvPath, tableId, season) {
    fetch(csvPath)
        .then(response => response.text())
        .then(data => {
            const rows = Papa.parse(data, { header: true }).data;

            // Filter rows for this season
            const filtered = rows.filter(r => r["Season"] == season);

            // Build DataTable
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
                    { title: "BB", data: "BB" },
                    { title: "AVG", data: "AVG" }
                ],
                paging: false,
                searching: false,
                info: false,
                order: [[9, "desc"]] // Sort by AVG
            });
        });
}

// -------------------------------
// Load Pitching CSV and filter by season
// -------------------------------
function loadSeason
