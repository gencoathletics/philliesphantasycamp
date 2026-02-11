console.log(">>> SEASONS.JS VERSION 5 (FINAL) <<<");

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

    // ⭐ Normalize CSV keys
    function normalizeRow(row) {
        const clean = {};
        Object.keys(row).forEach(key => clean[key.trim()] = row[key]);
        return clean;
    }

    // ⭐ Build full name + sorting key
    function buildPlayerName(row) {
        const first = row["FIRST_NAME"] || "";
        const last = row["LAST_NAME"] || "";
        return {
            display: `${first} ${last}`.trim(),
            sortKey: `${last.toLowerCase()}_${first.toLowerCase()}`
        };
    }

    function loadCSV(url, callback) {
        Papa.parse(url, {
            download: true,
            header: true,
            complete: results => callback(results.data)
        });
    }

    // ⭐ HITTING TABLE
    loadCSV(FILES.hitting, data => {
        data.forEach(raw => {
            const row = normalizeRow(raw);
            if (row["SEASON"] !== season) return;

            const tr = document.createElement("tr");

            // Build name + sort key
            const nameObj = buildPlayerName(row);

            const playerCell = document.createElement("td");
            playerCell.innerHTML = `
                <span style="display:none;">${nameObj.sortKey}</span>
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
    });

    // ⭐ PITCHING TABLE
    loadCSV(FILES.pitching, data => {
        data.forEach(raw => {
            const row = normalizeRow(raw);
            if (row["SEASON"] !== season) return;

            const tr = document.createElement("tr");

            const nameObj = buildPlayerName(row);

            const playerCell = document.createElement("td");
            playerCell.innerHTML = `
                <span style="display:none;">${nameObj.sortKey}</span>
                <a href="/philliesphantasycamp/players/player.html?id=${row["PLAYER ID"]}">
                    ${nameObj.display}
                </a>
            `;
            tr.appendChild(playerCell);

            ["IP","K","W","S","BB","R","H","ERA","WHIP"].forEach(f => {
                const td = document.createElement("td");
                td.textContent = row[f] || "";
                tr.appendChild(td);
            });

            pitchBody.appendChild(tr);
        });
    });

});
