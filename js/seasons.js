console.log(">>> SEASONS.JS VERSION 4 (with normalization) <<<");

document.addEventListener("DOMContentLoaded", function () {

    // Determine which season page we are on
    const season = document.body.getAttribute("data-season");

    if (!season) {
        console.error("No season found in data-season attribute");
        return;
    }

    const PATH = "/philliesphantasycamp/data/";

    const FILES = {
        hitting: PATH + "hitting_normalized.csv",
        pitching: PATH + "pitching_normalized.csv"
    };

    const hitBody = document.getElementById("hittingBody");
    const pitchBody = document.getElementById("pitchingBody");

    // ⭐ Normalize CSV row keys (fixes undefined player names + alignment)
    function normalizeRow(row) {
        const clean = {};
        Object.keys(row).forEach(key => {
            clean[key.trim()] = row[key];
        });
        return clean;
    }

    function loadCSV(url, callback) {
        Papa.parse(url, {
            download: true,
            header: true,
            complete: function (results) {
                callback(results.data);
            }
        });
    }

    // ⭐ HITTING TABLE
    loadCSV(FILES.hitting, data => {
        data.forEach(raw => {
            const row = normalizeRow(raw);

            if (row["SEASON"] === season) {

                const tr = document.createElement("tr");

                // Player name links to player page
                const playerCell = document.createElement("td");
                const id = row["PLAYER ID"];
                const name = row["PLAYER"];
                playerCell.innerHTML = `<a href="/philliesphantasycamp/players/player.html?id=${id}">${name}</a>`;
                tr.appendChild(playerCell);

                ["AB","H","R","RBI","2B","3B","HR","AVG"].forEach(f => {
                    const td = document.createElement("td");
                    td.textContent = row[f] || "";
                    tr.appendChild(td);
                });

                hitBody.appendChild(tr);
            }
        });
    });

    // ⭐ PITCHING TABLE
    loadCSV(FILES.pitching, data => {
        data.forEach(raw => {
            const row = normalizeRow(raw);

            if (row["SEASON"] === season) {

                const tr = document.createElement("tr");

                const playerCell = document.createElement("td");
                const id = row["PLAYER ID"];
                const name = row["PLAYER"];
                playerCell.innerHTML = `<a href="/philliesphantasycamp/players/player.html?id=${id}">${name}</a>`;
                tr.appendChild(playerCell);

                ["IP","K","W","S","BB","R","H","ERA","WHIP"].forEach(f => {
                    const td = document.createElement("td");
                    td.textContent = row[f] || "";
                    tr.appendChild(td);
                });

                pitchBody.appendChild(tr);
            }
        });
    });

});
