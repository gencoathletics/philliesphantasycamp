// -------------------------------
// Navigation Loader (same as other pages)
// -------------------------------
function loadNav() {
    fetch("/philliesphantasycamp/nav.html")
        .then(response => response.text())
        .then(html => {
            document.getElementById("nav-placeholder").innerHTML = html;
        })
        .catch(err => console.error("Navigation load error:", err));
}

// -------------------------------
// CSV Loader
// -------------------------------
function loadCSV(path) {
    return new Promise((resolve, reject) => {
        Papa.parse(path, {
            download: true,
            header: true,
            dynamicTyping: false,
            complete: results => resolve(results.data),
            error: err => reject(err)
        });
    });
}

// -------------------------------
// Helpers
// -------------------------------
function sortKey(row) {
    return `${row["LAST NAME"]} ${row["FIRST NAME"]}`.toUpperCase();
}

function formatAVG(value) {
    if (!value) return "";
    return Number(value).toFixed(3);
}

function format2(value) {
    if (!value) return "";
    return Number(value).toFixed(2);
}

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

    if (isNaN(whole) || isNaN(num) || isNaN(den) || den === 0) return whole;

    return whole + (num / den);
}

// -------------------------------
// Build Career Hitting Table
// -------------------------------
function buildCareerHittingTable(rows) {
    $("#careerHitting").DataTable({
        data: rows,
        destroy: true,
        columns: [
            {
                title: "Player",
                data: null,
                render: (row, type) => {
                    if (type === "sort") return sortKey(row);
                    return `<a href="/philliesphantasycamp/players/${row["PLAYER ID"]}.html">
                                ${row["FIRST NAME"]} ${row["LAST NAME"]}
                            </a>`;
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
                render: value => formatAVG(value)
            }
        ],
        order: [[0, "asc"]]
    });
}

// -------------------------------
// Build Career Pitching Table
// -------------------------------
function buildCareerPitchingTable(rows) {
    rows.forEach(row => {
        row.IP_SORT = convertFractionIP(row["IP"]);
    });

    $("#careerPitching").DataTable({
        data: rows,
        destroy: true,
        columns: [
            {
                title: "Player",
                data: null,
                render: (row, type) => {
                    if (type === "sort") return sortKey(row);
                    return `<a href="/philliesphantasycamp/players/${row["PLAYER ID"]}.html">
                                ${row["FIRST NAME"]} ${row["LAST NAME"]}
                            </a>`;
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
                render: value => format2(value)
            },
            {
                title: "WHIP",
                data: "WHIP",
                render: value => format2(value)
            },
            {
                title: "IP_SORT",
                data: "IP_SORT",
                visible: false,
                searchable: false
            }
        ],
        columnDefs: [
            { targets: 1, orderData: [10] }
        ],
        order: [[0, "asc"]]
    });
}

// -------------------------------
// Main Loader
// -------------------------------
async function loadCareer() {
    loadNav(); // load navigation first

    try {
        const hitting = await loadCSV("/philliesphantasycamp/data/hittingcareer_normalized.csv");
        const pitching = await loadCSV("/philliesphantasycamp/data/pitchingcareer_normalized.csv");

        buildCareerHittingTable(hitting);
        buildCareerPitchingTable(pitching);
    } catch (err) {
        console.error("Career page load error:", err);
    }
}

// -------------------------------
// Run on page load
// -------------------------------
document.addEventListener("DOMContentLoaded", loadCareer);
