// Load CSV helper
function loadCSV(path, callback) {
    Papa.parse(path, {
        download: true,
        header: true,
        dynamicTyping: false,   // keep IP as text like "99 2/3"
        complete: function (results) {
            callback(results.data);
        }
    });
}

// Build PLAYER sort key: "LAST FIRST"
function buildPlayerSortKey(row) {
    return `${row["LAST NAME"].trim().toUpperCase()} ${row["FIRST NAME"].trim().toUpperCase()}`;
}

// Convert baseball IP stored as "99 2/3" into a sortable number
function convertFractionIP(ipString) {
    if (!ipString || typeof ipString !== "string") return 0;

    const parts = ipString.trim().split(" ");

    if (parts.length === 1) {
        const wholeOnly = Number(parts[0]);
        return isNaN(wholeOnly) ? 0 : wholeOnly;
    }

    const whole = Number(parts[0]);
    const fraction = parts[1]; // e.g. "2/3"

    const fracParts = fraction.split("/");
    if (fracParts.length !== 2) return isNaN(whole) ? 0 : whole;

    const num = Number(fracParts[0]);
    const den = Number(fracParts[1]);

    if (isNaN(whole) || isNaN(num) || isNaN(den) || den === 0) {
        return isNaN(whole) ? 0 : whole;
    }

    return whole + (num / den);
}

// Format AVG to 3 decimals
function formatAVG(value) {
    if (!value) return "";
    return Number(value).toFixed(3);
}

// Format ERA/WHIP to 2 decimals
function format2(value) {
    if (!value) return "";
    return Number(value).toFixed(2);
}

// Build Season Hitting Table
function buildSeasonHittingTable(rows) {
    // Add PLAYER_SORT
    rows.forEach(row => {
        row.PLAYER_SORT = buildPlayerSortKey(row);
    });

    $('#seasonHitting').DataTable({
        data: rows,
        destroy: true,
        columns: [
            {
                title: "Player",
                data: null,
                render: function (row, type) {
                    if (type === "sort") return row.PLAYER_SORT;
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
            {
                data: "AVG",
                render: function (value) {
                    return formatAVG(value);
                }
            },
            {
                data: "PLAYER_SORT",
                visible: false,
                searchable: false
            }
        ],
        columnDefs: [
            {
                targets: 0,
                orderData: [9]   // use PLAYER_SORT
            }
        ],
        order: [[0, "asc"]]
    });
}

// Build Season Pitching Table
function buildSeasonPitchingTable(rows) {
    // Add PLAYER_SORT and IP_SORT
    rows.forEach(row => {
        row.PLAYER_SORT = buildPlayerSortKey(row);
        row.IP_SORT = convertFractionIP(row["IP"]);
    });

    $('#seasonPitching').DataTable({
        data: rows,
        destroy: true,
        columns: [
            {
                title: "Player",
                data: null,
                render: function (row, type) {
                    if (type === "sort") return row.PLAYER_SORT;
                    return `<a href="/philliesphantasycamp/players/${row["PLAYER ID"]}.html">${row["FIRST NAME"]} ${row["LAST NAME"]}</a>`;
                }
            },
            { data: "IP" },   // display "99 2/3"
            { data: "K" },
            { data: "W" },
            { data: "S" },
            { data: "BB" },
            { data: "R" },
            { data: "H" },
            {
                data: "ERA",
                render: function (value) {
                    return format2(value);
                }
            },
            {
                data: "WHIP",
                render: function (value) {
                    return format2(value);
                }
            },
            {
                data: "PLAYER_SORT",
                visible: false,
                searchable: false
            },
            {
                data: "IP_SORT",
                visible: false,
                searchable: false
            }
        ],
        columnDefs: [
            {
                targets: 0,
                orderData: [10]   // PLAYER_SORT
            },
            {
                targets: 1,
                orderData: [11]   // IP_SORT
            }
        ],
        order: [[0, "asc"]]
    });
}

// Main loader
function loadSeason(season) {
    loadCSV(`/philliesphantasycamp/data/hitting_normalized.csv`, function (rows) {
        const filtered = rows.filter(r => r.SEASON == season);
        buildSeasonHittingTable(filtered);
    });

    loadCSV(`/philliesphantasycamp/data/pitching_normalized.csv`, function (rows) {
        const filtered = rows.filter(r => r.SEASON == season);
        buildSeasonPitchingTable(filtered);
    });
}
