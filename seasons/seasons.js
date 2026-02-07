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
function loadSeasonPitchingCSV(csvPath, tableId, season) {
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
                    { title: "IP", data: "IP" },
                    { title: "K", data: "K" },
                    { title: "W", data: "W" },
                    { title: "S", data: "S" },
                    { title: "BB", data: "BB" },
                    { title: "R", data: "R" },
                    { title: "H", data: "H" },
                    { title: "ERA", data: "ERA" },
                    { title: "WHIP", data: "WHIP" }
                ],
                paging: false,
                searching: false,
                info: false,
                order: [[8, "asc"]] // Sort by ERA
            });
        });
}

// -------------------------------
// Populate season dropdown
// -------------------------------
function populateSeasonDropdown(currentSeason) {
    const dropdown = document.getElementById("seasonDropdown");

    const seasons = [
        "2026","2025","2024","2023","2022",
        "2020","2019","2018","2017","2016",
        "2015","2014","2013","2012","2011",
        "2010","2009"
    ];

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

    if (prev) {
        prev.href = `${seasonNum - 1}.html`;
        prev.textContent = `← ${seasonNum - 1} Season`;
    }

    if (next) {
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
