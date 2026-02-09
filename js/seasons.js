// Load CSV helper
function loadCSV(path, callback) {
    Papa.parse(path, {
        download: true,
        header: true,
        dynamicTyping: true,
        complete: function (results) {
            callback(results.data);
        }
    });
}

// Build Hitting Table
function buildSeasonHittingTable(rows, season) {
    const filtered = rows.filter(r => r.SEASON == season);

    $('#seasonHitting').DataTable({
        data: filtered,
        destroy: true,
        columns: [
            {
                title: "Player",
                data: null,
                render: function (row) {
                    return `<a href="../players/${row["PLAYER ID"]}.html">${row["FIRST NAME"]} ${row["LAST NAME"]}</a>`;
                }
            },
            { data: "AB" },
            { data: "H" },
            { data: "R" },
            { data: "RBI" },
            { data: "2B" },
            { data: "3B" },
            { data: "HR" },
            { data: "AVG" }
        ],
        order: [[0, "asc"]]
    });
}

// Build Pitching Table
function buildSeasonPitchingTable(rows, season) {
    const filtered = rows.filter(r => r.SEASON == season);

    $('#seasonPitching').DataTable({
        data: filtered,
        destroy: true,
        columns: [
            {
                title: "Player",
                data: null,
                render: function (row) {
                    return `<a href="../players/${row["PLAYER ID"]}.html">${row["FIRST NAME"]} ${row["LAST NAME"]}</a>`;
                }
            },
            { data: "IP" },
            { data: "K" },
            { data: "W" },
            { data: "S" },
            { data: "BB" },
            { data: "R" },
            { data: "H" },
            { data: "ERA" },
            { data: "WHIP" }
        ],
        order: [[9, "asc"]]   // ERA ascending
    });
}

// Populate the Jump-to-Season dropdown
function populateSeasonDropdown() {
    const dropdown = document.getElementById("seasonDropdown");

    for (let year = 2009; year <= 2026; year++) {
        const option = document.createElement("option");
        option.value = year;
        option.textContent = year;
        dropdown.appendChild(option);
    }

    dropdown.addEventListener("change", function () {
        if (this.value) {
            window.location.href = `${this.value}.html`;
        }
    });
}

// Main loader
function loadSeason(season) {
    loadCSV("../data/hitting_normalized.csv", data => buildSeasonHittingTable(data, season));
    loadCSV("../data/pitching_normalized.csv", data => buildSeasonPitchingTable(data, season));
}

// Initialize dropdown on page load
populateSeasonDropdown();
