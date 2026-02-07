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
            const filtered = rows.filter(r => r.season == season);

            // Build DataTable
            $(`#${tableId}`).DataTable({
                data: filtered,
                columns: [
                    { title: "Player", data: "player" },
                    { title: "Team", data: "team" },
                    { title: "AB", data: "ab" },
                    { title: "H", data: "h" },
                    { title: "AVG", data: "avg" },
                    { title: "HR", data: "hr" },
                    { title: "RBI", data: "rbi" }
                ],
                paging: false,
                searching: false,
                info: false,
                order: [[4, "desc"]]
            });
        });
}

// -------------------------------
// Load Pitching CSV and filter by season
// -------------------------------
function loadSeasonPitchingCSV(csvPath, tableId, season) {
    fetch(csvPath)
        .then(response => response.text())
        .then(data => {
            const rows = Papa.parse(data, { header: true }).data;

            // Filter rows for this season
            const filtered = rows.filter(r => r.season == season);

            // Build DataTable
            $(`#${tableId}`).DataTable({
                data: filtered,
                columns: [
                    { title: "Player", data: "player" },
                    { title: "Team", data: "team" },
                    { title: "IP", data: "ip" },
                    { title: "ER", data: "er" },
                    { title: "ERA", data: "era" },
                    { title: "K", data: "k" },
                    { title: "BB", data: "bb" }
                ],
                paging: false,
                searching: false,
                info: false,
                order: [[4, "asc"]]
            });
        });
}

// -------------------------------
// Populate season dropdown
// -------------------------------
function populateSeasonDropdown(currentSeason) {
    const dropdown = document.getElementById("seasonDropdown");

    const seasons = ["2026", "2025", "2024", "2023", "2022", "2021", "2020"];

    seasons.forEach(season => {
        const option = document.createElement("option");
        option.value = `${season}.html`;
        option.textContent = season;
        if (season == currentSeason) option.selected = true;
        dropdown.appendChild(option);
    });

    dropdown.addEventListener("change", () => {
        window.location.href = dropdown.value;
    });
}

// -------------------------------
// Build Previous / Next season links
// -------------------------------
function buildPrevNextLinks(currentSeason) {
    const seasonNum = parseInt(currentSeason);

    const prev = document.getElementById("prevSeason");
    const next = document.getElementById("nextSeason");

    if (document.getElementById("prevSeason")) {
        prev.href = `${seasonNum - 1}.html`;
        prev.textContent = `← ${seasonNum - 1} Season`;
    }

    if (document.getElementById("nextSeason")) {
        next.href = `${seasonNum + 1}.html`;
        next.textContent = `${seasonNum + 1} Season →`;
    }
}

// -------------------------------
// Initialize Season Page
// -------------------------------
document.addEventListener("DOMContentLoaded", () => {
    const season = getSeasonFromURL();

    // Load tables
    loadSeasonHittingCSV("../data/hitting_normalized.csv", "seasonHitting", season);
    loadSeasonPitchingCSV("../data/pitching_normalized.csv", "seasonPitching", season);

    // Dropdown + navigation
    populateSeasonDropdown(season);
    buildPrevNextLinks(season);
});
