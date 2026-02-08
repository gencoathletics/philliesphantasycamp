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

            const rows = parsed.map(normalizeRow);
            const filtered = rows.filter(r => r["SEASON"] == season);

            $(`#${tableId}`).DataTable({
                data: filtered,
                columns: [
                    {
                        title: "Player",
                        data: null,
                        render: function (data, type, row) {
                            const id = row["PLAYER ID"];
                            const first = row["FIRST NAME"];
                            const last = row["LAST NAME"];
                            const full = `${first} ${last}`;
                            return `<a href="../players/player.html?id=${id}">${full}</a>`;
                        },
                        orderData: [2, 1] // sort by LAST NAME then FIRST NAME
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
                columnDefs: [
                    { targets: [0, 2], visible: false, searchable: false } // hide PLAYER ID + LAST NAME
                ],
                paging: false,
                searching: false,
                info: false,
                order: [[0, "asc"]]
            });
        });
}

// -------------------------------
// Load Pitching CSV
// -------------------------------
function loadSeasonPitchingCSV(csvPath, tableId, season) {
    fetch(csvPath)
        .then(r => r.text())
        .then(text => {
            const parsed = Papa.parse(text, { header: true }).data;

            const rows = parsed.map(normalizeRow);
            const filtered = rows.filter(r => r["SEASON"] == season);

            $(`#${tableId}`).DataTable({
                data: filtered,
                columns: [
                    {
                        title: "Player",
                        data: null,
                        render: function (data, type, row) {
                            const id = row["PLAYER ID"];
                            const first = row["FIRST NAME"];
                            const last = row["LAST NAME"];
                            const full = `${first} ${last}`;
                            return `<a href="../players/player.html?id=${id}">${full}</a>`;
                        },
                        orderData: [2, 1] // sort by LAST NAME then FIRST NAME
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
                columnDefs: [
                    { targets: [0, 2], visible: false, searchable: false } // hide PLAYER ID + LAST NAME
                ],
                paging: false,
                searching: false,
                info: false,
                order: [[0, "asc"]]
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
// Prev/Next links
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
// Initialize
// -------------------------------
document.addEventListener("DOMContentLoaded", () => {
    const season = getSeasonFromURL();

    loadSeasonHittingCSV("../data/hitting_normalized.csv", "seasonHitting", season);
    loadSeasonPitchingCSV("../data/pitching_normalized.csv", "seasonPitching", season);

    populateSeasonDropdown(season);
    buildPrevNextLinks(season);
});
