// Load CSV helper
function loadCSV(path, callback) {
    Papa.parse(path, {
        download: true,
        header: true,
        dynamicTyping: false,   // IMPORTANT: keep IP as text
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

    // Example: "99 2/3"
    const parts = ipString.trim().split(" ");

    if (parts.length === 1) {
        // No fraction, just a whole number
        return Number(parts[0]);
    }

    const whole = Number(parts[0]);
    const fraction = parts[1]; // "2/3"

    const [num, den] = fraction.split("/").map(Number);

    if (!isNaN(whole) && !isNaN(num) && !isNaN(den) && den !== 0) {
        return whole + (num / den);
    }

    return whole;
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
                data: "IP",
                render: function (value, type) {
                    if (type === "sort") return convertFractionIP(value);
                    return value; // display exactly as CSV
                }
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
