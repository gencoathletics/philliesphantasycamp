// Helper: get querystring value (player ID)
function getPlayerID() {
    const params = new URLSearchParams(window.location.search);
    return params.get("id");
}

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

// Build Hitting Season Table
function buildPlayerHittingTable(rows, playerID) {
    const filtered = rows.filter(r => r["PLAYER ID"] == playerID);

    $('#playerHitting').DataTable({
        data: filtered,
        destroy: true,
        columns: [
            { data: "SEASON" },
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

// Build Pitching Season Table
function buildPlayerPitchingTable(rows, playerID) {
    const filtered = rows.filter(r => r["PLAYER ID"] == playerID);

    $('#playerPitching').DataTable({
        data: filtered,
        destroy: true,
        columns: [
            { data: "SEASON" },
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
        order: [[0, "asc"]]
    });
}

// Build Career Hitting Table
function buildPlayerCareerHittingTable(rows, playerID) {
    const filtered = rows.filter(r => r["PLAYER ID"] == playerID);

    $('#playerCareerHitting').DataTable({
        data: filtered,
        destroy: true,
        searching: false,
        paging: false,
        info: false,
        columns: [
            { data: "AB" },
            { data: "H" },
            { data: "R" },
            { data: "RBI" },
            { data: "2B" },
            { data: "3B" },
            { data: "HR" },
            { data: "AVG" }
        ]
    });
}

// Build Career Pitching Table
function buildPlayerCareerPitchingTable(rows, playerID) {
    const filtered = rows.filter(r => r["PLAYER ID"] == playerID);

    $('#playerCareerPitching').DataTable({
        data: filtered,
        destroy: true,
        searching: false,
        paging: false,
        info: false,
        columns: [
            { data: "IP" },
            { data: "K" },
            { data: "W" },
            { data: "S" },
            { data: "BB" },
            { data: "R" },
            { data: "H" },
            { data: "ERA" },
            { data: "WHIP" }
        ]
    });
}

// Set Player Header Name
function setPlayerHeader(rows, playerID) {
    const player = rows.find(r => r["PLAYER ID"] == playerID);
    if (player) {
        document.getElementById("playerName").textContent =
            `${player["FIRST NAME"]} ${player["LAST NAME"]}`;
    }
}

// Main loader
function loadPlayerPage() {
    const playerID = getPlayerID();

    // Load hitting season stats
    loadCSV("../data/hitting_normalized.csv", data => {
        setPlayerHeader(data, playerID);
        buildPlayerHittingTable(data, playerID);
    });

    // Load pitching season stats
    loadCSV("../data/pitching_normalized.csv", data => {
        buildPlayerPitchingTable(data, playerID);
    });

    // Load career hitting
    loadCSV("../data/hittingcareer_normalized.csv", data => {
        buildPlayerCareerHittingTable(data, playerID);
    });

    // Load career pitching
    loadCSV("../data/pitchingcareer_normalized.csv", data => {
        buildPlayerCareerPitchingTable(data, playerID);
    });
}
