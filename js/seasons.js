console.log(">>> SEASONS.JS VERSION 9 <<<");

document.addEventListener("DOMContentLoaded", function () {

    const season = document.body.getAttribute("data-season");
    if (!season) return;

    const PATH = "/philliesphantasycamp/data/";

    const FILES = {
        hitting: PATH + "hitting_normalized.csv",
        pitching: PATH + "pitching_normalized.csv"
    };

    const hitBody = document.getElementById("hittingBody");
    const pitchBody = document.getElementById("pitchingBody");

    let hittingLoaded = false;
    let pitchingLoaded = false;

    function normalizeRow(row) {
        const clean = {};
        Object.keys(row).forEach(key => clean[key.trim()] = row[key]);
        return clean;
    }

    function buildPlayerName(row) {
        const first = row["FIRST NAME"] || "";
        const last = row["LAST NAME"] || "";
        return {
            display: `${first} ${last}`.trim(),
            sortKey: `${last.toLowerCase()}_${first.toLowerCase()}`
        };
    }

    // Convert "16 2/3" → 16.666..., "8 1/3" → 8.333..., "7" → 7
    function parseIP(ipStr) {
        if (!ipStr) return 0;
        const parts = ipStr.trim().split(" ");
        let whole = 0;
        let frac = 0;

        if (parts.length === 1) {
            whole = parseFloat(parts[0]) || 0;
        } else {
            whole = parseFloat(parts[0]) || 0;
            const fracPart = parts[1]; // e.g. "2/3"
            const [num, den] = fracPart.split("/").map(Number);
            if (num && den) frac = num / den;
        }
        return whole + frac;
    }

    function loadCSV(url, callback) {
        Papa.parse(url, {
            download: true,
            header: true,
            complete: results => callback(results.data)
        });
    }

    function tryInitTables() {
        if (hittingLoaded && !$.fn.dataTable.isDataTable('#hittingTable')) {
            $('#hittingTable').DataTable({
                columnDefs: [
                    { targets: 0, visible: false }, // hidden last-name sort
                    { targets: 1, orderData: 0 }    // Player uses col 0
                ],
                order: [[0, 'asc']]
            });
        }
        if (pitchingLoaded && !$.fn.dataTable.isDataTable('#pitchingTable')) {
            $('#pitchingTable').DataTable({
                columnDefs: [
                    { targets: 0, visible: false }, // hidden last-name sort
                    { targets: 2, visible: false }, // hidden IP numeric sort
                    { targets: 1, orderData: 0 },   // Player uses col 0
                    { targets: 3, orderData: 2 }    // IP uses col 2
                ],
                order: [[0, 'asc']]
            });
        }
    }

    // HITTING
    loadCSV(FILES.hitting, data => {
        data.forEach(raw => {
            const row = normalizeRow(raw);
            if (row["SEASON"] !== season) return;

            const tr = document.createElement("tr");
            const nameObj = buildPlayerName(row);

            // hidden last-name sort
            const sortCell = document.createElement("td");
            sortCell.style.display = "none";
            sortCell.textContent = nameObj.sortKey;
            tr.appendChild(sortCell);

            // visible player
            const playerCell = document.createElement("td");
            playerCell.innerHTML = `
                <a href="/philliesphantasycamp/players/player.html?id=${row["PLAYER ID"]}">
                    ${nameObj.display}
                </a>
            `;
            tr.appendChild(playerCell);

            ["AB","H","R","RBI","2B","3B","HR","AVG"].forEach(f => {
                const td = document.createElement("td");
                td.textContent = row[f] || "";
                tr.appendChild(td);
            });

            hitBody.appendChild(tr);
        });

        hittingLoaded = true;
        tryInitTables();
    });

    // PITCHING
    loadCSV(FILES.pitching, data => {
        data.forEach(raw => {
            const row = normalizeRow(raw);
            if (row["SEASON"] !== season) return;

            const tr = document.createElement("tr");
            const nameObj = buildPlayerName(row);

            // hidden last-name sort
            const sortCell = document.createElement("td");
            sortCell.style.display = "none";
            sortCell.textContent = nameObj.sortKey;
            tr.appendChild(sortCell);

            // visible player
            const playerCell = document.createElement("td");
            playerCell.innerHTML = `
                <a href="/philliesphantasycamp/players/player.html?id=${row["PLAYER ID"]}">
                    ${nameObj.display}
                </a>
            `;
            tr.appendChild(playerCell);

            // hidden numeric IP sort
            const ipSortCell = document.createElement("td");
            ipSortCell.style.display = "none";
            ipSortCell.textContent = parseIP(row["IP"]);
            tr.appendChild(ipSortCell);

            // visible IP
            const ipCell = document.createElement("td");
            ipCell.textContent = row["IP"] || "";
            tr.appendChild(ipCell);

            ["K","W","S","BB","R","H","ERA","WHIP"].forEach(f => {
                const td = document.createElement("td");
                td.textContent = row[f] || "";
                tr.appendChild(td);
            });

            pitchBody.appendChild(tr);
        });

        pitchingLoaded = true;
        tryInitTables();
    });

});
