// ------------------------------
// CSV Loader
// ------------------------------
function loadCSV(path, callback) {
    Papa.parse(path, {
        download: true,
        header: true,
        dynamicTyping: false, // keep IP text like "5 2/3"
        complete: function (results) {
            callback(results.data);
        }
    });
}

// ------------------------------
// Helpers
// ------------------------------
function sortKey(row) {
    return `${row["LAST NAME"]} ${row["FIRST NAME"]}`.toUpperCase();
}

function convertFractionIP(ipString) {
    if (!ipString || typeof ipString !== "string") return 0;

    const parts = ipString.trim().split(" ");

    if (parts.length === 1) {
        const wholeOnly = Number(parts[0]);
        return isNaN(wholeOnly) ? 0 : wholeOnly;
    }

    const whole = Number(parts[0]);
    const fraction = parts[1].split("/");

    if (fraction.length !== 2) return whole || 0;

    const num = Number(fraction[0]);
    const den = Number(fraction[1]);

    if (isNaN(whole) || isNaN(num) || isNaN(den) || den === 0) return whole || 0;

    return whole + (num / den);
}

function formatAVG(value) {
    if (!value) return "";
    return Number(value).toFixed(3);
}

function format2(value) {
    if (!value) return "";
    return Number(value).toFixed(2);
}

// ------------------------------
// Career Hitting Table
// ------------------------------
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
                    return `<a href="/philliesphantasycamp/players/${row["PLAYER ID"]}.html">
                                ${row["FIRST NAME"]} ${row["LAST NAME"]}
                            </a>`;
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
                render: formatAVG
            }
        ],
        order: [[0, "asc"]]
    });
}

// ------------------------------
// Career Pitching Table
// ------------------------------
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
                    return `<a href="/philliesphantasycamp/players/${row["PLAYER ID"]}.html">
                                ${row["FIRST NAME"]} ${row["LAST NAME"]}
                            </a>`;
                }
            },
            { data: "IP" },
            { data: "K" },
            { data: "W" },
            { data: "S" },
            { data: "BB" },
            { data: "R" },
            { data: "H" },
            {
                data: "ERA",
                render: format2
            },
            {
                data: "WHIP",
                render: format2
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

// ------------------------------
// Main Loader
// ------------------------------
function loadCareer() {
    loadCSV("/philliesphantasycamp/data/hittingcareer_normalized.csv", buildCareerHittingTable);
    loadCSV("/philliesphantasycamp/data/pitchingcareer_normalized.csv", buildCareerPitchingTable);
}

loadCareer();
