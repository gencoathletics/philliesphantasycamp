// -------------------------------
// CSV PATHS
// -------------------------------
const HITTING_CAREER_CSV = "/philliesphantasycamp/data/hittingcareer_normalized.csv";
const PITCHING_CAREER_CSV = "/philliesphantasycamp/data/pitchingcareer_normalized.csv";

// -------------------------------
// LOAD CSV (PapaParse)
// -------------------------------
function loadCSV(path, callback) {
    Papa.parse(path, {
        download: true,
        header: true,
        dynamicTyping: false,
        complete: function (results) {
            callback(results.data);
        }
    });
}

// -------------------------------
// SORT KEY: "LAST FIRST"
// -------------------------------
function sortKey(row) {
    return `${row["LAST NAME"]} ${row["FIRST NAME"]}`.toUpperCase();
}

// -------------------------------
// Convert "99 2/3" → numeric
// -------------------------------
function convertFractionIP(ipString) {
    if (!ipString || typeof ipString !== "string") return 0;

    const parts = ipString.trim().split(" ");

    if (parts.length === 1) {
        const wholeOnly = Number(parts[0]);
        return isNaN(wholeOnly) ? 0 : wholeOnly;
    }

    const whole = Number(parts[0]);
    const fraction = parts[1];

    const fracParts = fraction.split("/");
    if (fracParts.length !== 2) return whole;

    const num = Number(fracParts[0]);
    const den = Number(fracParts[1]);

    if (isNaN(num) || isNaN(den) || den === 0) return whole;

    return whole + (num / den);
}

// -------------------------------
// Formatters
// -------------------------------
function formatAVG(value) {
    if (!value) return "";
    return Number(value).toFixed(3);
}

function format2(value) {
    if (!value) return "";
    return Number(value).toFixed(2);
}

// -------------------------------
// CAREER HITTING TABLE
// -------------------------------
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
            { title: "AB", data: "AB" },
            { title: "H", data: "H" },
            { title: "R", data: "R" },
            { title: "RBI", data: "RBI" },
            { title: "2B", data: "2B" },
            { title: "3B", data: "3B" },
            { title: "HR", data: "HR" },
            {
                title: "AVG",
                data: "AVG",
                render: function (value) {
                    return formatAVG(value);
                }
            }
        ],
        order: [[0, "asc"]]
    });
}

// -------------------------------
// CAREER PITCHING TABLE
// -------------------------------
function buildCareerPitchingTable(rows) {
    rows.forEach(row => {
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
            { title: "IP", data: "IP" },
            { title: "K", data: "K" },
            { title: "W", data: "W" },
            { title: "S", data: "S" },
            { title: "BB", data: "BB" },
            { title: "R", data: "R" },
            { title: "H", data: "H" },
            {
                title: "ERA",
                data: "ERA",
                render: function (value) {
                    return format2(value);
                }
            },
            {
                title: "WHIP",
                data: "WHIP",
                render: function (value) {
                    return format2(value);
                }
            },
            {
                data: "IP_SORT",
                visible: false,
                searchable: false
            }
        ],
        columnDefs: [
            {
                targets: 1,
                orderData: [10]
            }
        ],
        order: [[0, "asc"]]
    });
}

// -------------------------------
// LOAD BOTH TABLES
// -------------------------------
function loadCareer() {
    loadCSV(HITTING_CAREER_CSV, buildCareerHittingTable);
    loadCSV(PITCHING_CAREER_CSV, buildCareerPitchingTable);
}

// -------------------------------
// NAVIGATION BAR (same as other pages)
// -------------------------------
function loadNav() {
    $("#nav").load("/philliesphantasycamp/nav.html");
}

// -------------------------------
// RUN ON PAGE LOAD
// -------------------------------
$(document).ready(function () {
    loadNav();
    loadCareer();
});
