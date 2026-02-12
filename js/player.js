console.log(">>> LOADED player.js <<<");

document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const playerId = urlParams.get("id");

    if (!playerId) {
        document.getElementById("playerName").textContent = "Player Not Found";
        return;
    }

    // CSV PATHS — ALL CORRECT
    const PATH = "/philliesphantasycamp/data/";

    const FILES = {
        seasonHitting: PATH + "hitting_normalized.csv",
        seasonPitching: PATH + "pitching_normalized.csv",
        careerHitting: PATH + "hittingcareer_normalized.csv",
        careerPitching: PATH + "pitchingcareer_normalized.csv"
    };

    // DOM TARGETS
    const nameEl = document.getElementById("playerName");
    const loadingEl = document.getElementById("loadingMessage");

    const seasonHitBody = document.getElementById("seasonHittingBody");
    const seasonPitchBody = document.getElementById("seasonPitchingBody");
    const careerHitBody = document.getElementById("careerHittingBody");
    const careerPitchBody = document.getElementById("careerPitchingBody");

    let playerName = null;
    let loadCount = 0;

    function checkDone() {
        loadCount++;
        if (loadCount === 4) {
            loadingEl.style.display = "none";
            if (playerName) nameEl.textContent = playerName;
        }
    }

    // GENERIC CSV LOADER
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

    // RENDER HELPERS
    function addRow(tbody, row, fields) {
        const tr = document.createElement("tr");
        fields.forEach(f => {
            const td = document.createElement("td");
            td.textContent = row[f] || "";
            tr.appendChild(td);
        });
        tbody.appendChild(tr);
    }

    // 1️⃣ CAREER HITTING
    loadCSV(FILES.careerHitting, data => {
        data.forEach(row => {
            if (row["PLAYER ID"] === playerId) {
                if (!playerName) {
                    playerName = `${row["FIRST NAME"]} ${row["LAST NAME"]}`;
                }
                addRow(careerHitBody, row, ["AB", "H", "R", "RBI", "2B", "3B", "HR", "AVG"]);
            }
        });
    });

    // 2️⃣ CAREER PITCHING
    loadCSV(FILES.careerPitching, data => {
        data.forEach(row => {
            if (row["PLAYER ID"] === playerId) {
                addRow(careerPitchBody, row, ["IP", "K", "W", "S", "BB", "R", "H", "ERA", "WHIP"]);
            }
        });
    });

    // 3️⃣ SEASON HITTING
    loadCSV(FILES.seasonHitting, data => {
        data.forEach(row => {
            if (row["PLAYER ID"] === playerId) {
                addRow(seasonHitBody, row, ["SEASON", "AB", "H", "R", "RBI", "2B", "3B", "HR", "AVG"]);
            }
        });
    });

    // 4️⃣ SEASON PITCHING
    loadCSV(FILES.seasonPitching, data => {
        data.forEach(row => {
            if (row["PLAYER ID"] === playerId) {
                addRow(seasonPitchBody, row, ["SEASON", "IP", "K", "W", "S", "BB", "R", "H", "ERA", "WHIP"]);
            }
        });
    });

});
