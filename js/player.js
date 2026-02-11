console.log(">>> PLAYER.JS VERSION 5 <<<");

document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const playerId = urlParams.get("id");

    if (!playerId) {
        document.getElementById("playerName").textContent = "Player Not Found";
        return;
    }

    const PATH = "/philliesphantasycamp/data/";

    const FILES = {
        seasonHitting: PATH + "hitting_normalized.csv",
        seasonPitching: PATH + "pitching_normalized.csv",
        careerHitting: PATH + "hittingcareer_normalized.csv",
        careerPitching: PATH + "pitchingcareer_normalized.csv"
    };

    const nameEl = document.getElementById("playerName");
    const loadingEl = document.getElementById("loadingMessage");

    const seasonHitBody = document.getElementById("seasonHittingBody");
    const seasonPitchBody = document.getElementById("seasonPitchingBody");
    const careerHitBody = document.getElementById("careerHittingBody");
    const careerPitchBody = document.getElementById("careerPitchingBody");

    const summaryBar = document.getElementById("careerSummary");
    const sumAVG = document.getElementById("sumAVG");
    const sumH = document.getElementById("sumH");
    const sumIP = document.getElementById("sumIP");
    const sumERA = document.getElementById("sumERA");

    let playerName = null;
    let loadCount = 0;

    let careerAVG = null;
    let careerH = null;
    let careerIP = null;
    let careerERA = null;

    function checkDone() {
        loadCount++;
        if (loadCount === 4) {
            loadingEl.style.display = "none";
            if (playerName) nameEl.textContent = playerName;

            summaryBar.style.display = "flex";

            sumAVG.textContent = careerAVG ?? "–";
            sumH.textContent = careerH ?? "–";
            sumIP.textContent = careerIP ?? "–";
            sumERA.textContent = careerERA ?? "–";
        }
    }

    function loadCSV(url, callback) {
        Papa.parse(url, {
            download: true,
            header: true,
            complete: function (results) {
                callback(results.data);
                checkDone();
            }
        });
    }

    function addRow(tbody, row, fields) {
        const tr = document.createElement("tr");
        fields.forEach(f => {
            const td = document.createElement("td");
            td.textContent = row[f] || "";
            tr.appendChild(td);
        });
        tbody.appendChild(tr);
    }

    // CAREER HITTING
    loadCSV(FILES.careerHitting, data => {
        data.forEach(row => {
            if (row["PLAYER ID"] === playerId) {
                if (!playerName) {
                    playerName = `${row["FIRST NAME"]} ${row["LAST NAME"]}`;
                }

                careerAVG = row["AVG"] || "–";
                careerH = row["H"] || "0";

                addRow(careerHitBody, row, ["AB", "H", "R", "RBI", "2B", "3B", "HR", "AVG"]);
            }
        });
    });

    // CAREER PITCHING
    loadCSV(FILES.careerPitching, data => {
        data.forEach(row => {
            if (row["PLAYER ID"] === playerId) {
                careerIP = row["IP"] || "0";
                careerERA = row["ERA"] || "–";

                addRow(careerPitchBody, row, ["IP", "K", "W", "S", "BB", "R", "H", "ERA", "WHIP"]);
            }
        });
    });

    // SEASON HITTING (Season links)
    loadCSV(FILES.seasonHitting, data => {
        data.forEach(row => {
            if (row["PLAYER ID"] === playerId) {
                const tr = document.createElement("tr");

                const season = row["SEASON"];
                const seasonCell = document.createElement("td");
                seasonCell.innerHTML = `<a href="/philliesphantasycamp/seasons/${season}.html">${season}</a>`;
                tr.appendChild(seasonCell);

                ["AB","H","R","RBI","2B","3B","HR","AVG"].forEach(f => {
                    const td = document.createElement("td");
                    td.textContent = row[f] || "";
                    tr.appendChild(td);
                });

                seasonHitBody.appendChild(tr);
            }
        });
    });

    // SEASON PITCHING (Season links)
    loadCSV(FILES.seasonPitching, data => {
        data.forEach(row => {
            if (row["PLAYER ID"] === playerId) {
                const tr = document.createElement("tr");

                const season = row["SEASON"];
                const seasonCell = document.createElement("td");
                seasonCell.innerHTML = `<a href="/philliesphantasycamp/seasons/${season}.html">${season}</a>`;
                tr.appendChild(seasonCell);

                ["IP","K","W","S","BB","R","H","ERA","WHIP"].forEach(f => {
                    const td = document.createElement("td");
                    td.textContent = row[f] || "";
                    tr.appendChild(td);
                });

                seasonPitchBody.appendChild(tr);
            }
        });
    });

});
