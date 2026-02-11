console.log(">>> PLAYER.JS VERSION 2 <<<");

document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const playerId = urlParams.get("id");

    if (!playerId) {
        document.getElementById("playerName").textContent = "Player Not Found";
        return;
    }

    
    // CSV PATHS
    const PATH = "/philliesphantasycamp/data/";

    const FILES = {
    seasonHitting: "/philliesphantasycamp/data/hittingseason_normalized.csv",
    seasonPitching: "/philliesphantasycamp/data/pitchingseason_normalized.csv",
    careerHitting: "/philliesphantasycamp/data/hittingcareer_normalized.csv",
    careerPitching: "/philliesphantasycamp/data/pitchingcareer_normalized.csv"
};

    // DOM TARGETS
    const nameEl = document.getElementById("playerName");
    const loadingEl = document.getElementById("loadingMessage");

    const seasonHitBody = document.getElementById("seasonHittingBody");
    const seasonPitchBody = document.getElementById("seasonPitchingBody");
    const careerHitBody = document.getElementById("careerHittingBody");
    const careerPitchBody = document.getElementById("careerPitchingBody");

    // Summary bar elements
    const summaryBar = document.getElementById("careerSummary");
    const sumAVG = document.getElementById("sumAVG");
    const sumHR = document.getElementById("sumHR");
    const sumRBI = document.getElementById("sumRBI");
    const sumERA = document.getElementById("sumERA");
    const sumIP = document.getElementById("sumIP");

    let playerName = null;
    let loadCount = 0;

    // Summary values
    let careerAVG = null;
    let careerHR = null;
    let careerRBI = null;
    let careerERA = null;
    let careerIP = null;

    function checkDone() {
        loadCount++;
        if (loadCount === 4) {
            loadingEl.style.display = "none";
            if (playerName) nameEl.textContent = playerName;

            // Show summary bar once all data is loaded
            summaryBar.style.display = "flex";

            // Populate summary bar
            sumAVG.textContent = careerAVG ?? "–";
            sumHR.textContent = careerHR ?? "–";
            sumRBI.textContent = careerRBI ?? "–";
            sumERA.textContent = careerERA ?? "–";
            sumIP.textContent = careerIP ?? "–";
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

                // Capture player name
                if (!playerName) {
                    playerName = `${row["FIRST NAME"]} ${row["LAST NAME"]}`;
                }

                // Capture summary stats
                careerAVG = row["AVG"] || "–";
                careerHR = row["HR"] || "0";
                careerRBI = row["RBI"] || "0";

                // Add table row
                addRow(careerHitBody, row, ["AB", "H", "R", "RBI", "2B", "3B", "HR", "AVG"]);
            }
        });
    });

    // 2️⃣ CAREER PITCHING
    loadCSV(FILES.careerPitching, data => {
        data.forEach(row => {
            if (row["PLAYER ID"] === playerId) {

                // Capture summary stats
                careerERA = row["ERA"] || "–";
                careerIP = row["IP"] || "0";

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
