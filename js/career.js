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

// Helper to build a sort key: "LAST FIRST"
function sortKey(row) {
    return `${row["LAST NAME"]} ${row["FIRST NAME"]}`.toUpperCase();
}

// Convert baseball IP stored as "99 2/3" into a sortable number
function convertFractionIP(ipString) {
    if (!ipString || typeof ipString !== "string") return 0;

    const parts = ipString.trim().split(" ");

    if (parts.length === 1) {
        // No fraction, just a whole number
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

// Build Career Hitting Table
function buildCareerHittingTable(rows) {
    $('#careerHitting').DataTable({
        data: rows,
        destroy: true,
        columns: [
            {
                title: "Player",
                data: null,
                render: function (row, type) {
                    if (type === "sort") return sortKey(row);
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
            }
        ],
        order: [[0, "asc"]]
    });
}

// Build Career Pitching Table
function buildCareerPitchingTable(rows) {
    // Precompute a numeric sort key for IP
    rows.forEach(function (row) {
        row.IP_SORT = convertFractionIP(row["IP"]);
    });

    $('#careerPitching').DataTable({
        data: rows,
        destroy: true,
        columns: [
            {
                title: "Player",
                data: null,
                render: function (row, type) {
                    if (type === "sort") return sortKey(row);
                    return `<a href="/philliesphantasycamp/players/${row["PLAYER ID"]}.html">${row["FIRST NAME"]} ${row["LAST NAME"]}</a>`;
                }
            },
            {
                data: "IP",   // display "99 2/3"
            },
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
                data: "IP_SORT",   // hidden numeric sort key
                visible: false,
                searchable: false
            }
        ],
        columnDefs: [
            {
                targets: 1,       // IP column
                orderData: [10]   // sort using IP_SORT (last column)
            }
        ],
        order: [[0, "asc"]]
    });
}

// Main loader
function loadCareer() {
    loadCSV("/philliesphantasycamp/data/hittingcareer_normalized.csv", buildCareerHittingTable);
    loadCSV("/philliesphantasycamp/data/pitchingcareer_normalized.csv", buildCareerPitchingTable);
}

// Run on page load
loadCareer();
