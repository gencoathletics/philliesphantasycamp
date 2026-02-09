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

// Build Career Hitting Table
function buildCareerHittingTable(rows) {
    $('#careerHitting').DataTable({
        data: rows,
        destroy: true,
        columns: [
            {
                title: "Player",
                data: null,
                render: function (row) {
                    return `<a href="/philliesphantasycamp/players/${row["PLAYER ID"]}.html">${row["FIRST NAME"]} ${row["LAST NAME"]}</a>`;
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

// Build Career Pitching Table
function buildCareerPitchingTable(rows) {
    $('#careerPitching').DataTable({
        data: rows,
        destroy: true,
        columns: [
            {
                title: "Player",
                data: null,
                render: function (row) {
                    return `<a href="/philliesphantasycamp/players/${row["PLAYER ID"]}.html">${row["FIRST NAME"]} ${row["LAST NAME"]}</a>`;
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
function loadCareer() {
    loadCSV("/philliesphantasycamp/data/hittingcareer_normalized.csv", buildCareerHittingTable);
    loadCSV("/philliesphantasycamp/data/pitchingcareer_normalized.csv", buildCareerPitchingTable);
}

// Run on page load
loadCareer();
