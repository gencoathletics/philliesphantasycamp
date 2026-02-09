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

// Main loader
function loadSeason(season) {
    loadCSV("../data/hitting_normalized.csv", data => buildSeasonHittingTable(data, season));
    loadCSV("../data/pitching_normalized.csv", data => buildSeasonPitchingTable(data, season));
}
