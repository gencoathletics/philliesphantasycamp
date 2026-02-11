// ===============================
// Player Page Loader (v5)
// ===============================

// CSV paths
const HITTING_CAREER_CSV = "/philliesphantasycamp/data/hittingcareer_normalized.csv";
const PITCHING_CAREER_CSV = "/philliesphantasycamp/data/pitchingcareer_normalized.csv";
const HITTING_SEASON_CSV = "/philliesphantasycamp/data/hitting_normalized.csv";
const PITCHING_SEASON_CSV = "/philliesphantasycamp/data/pitching_normalized.csv";

// Extract player ID from URL
function getPlayerID() {
    const params = new URLSearchParams(window.location.search);
    return params.get("id");
}

// Load a CSV and return a Promise of parsed rows
function loadCSV(path) {
    return new Promise((resolve, reject) => {
        Papa.parse(path, {
            download: true,
            header: true,
            dynamicTyping: true,
            complete: (results) => resolve(results.data),
            error: (err) => reject(err)
        });
    });
}

// Insert a row into a table body
function addRow(bodyID, values) {
    const tbody = document.getElementById(bodyID);
    const tr = document.createElement("tr");

    values.forEach(v => {
        const td = document.createElement("td");
        td.textContent = v;
        tr.appendChild(td);
    });

    tbody.appendChild(tr);
}

// Format IP (stored as decimal) into baseball-style (e.g., 4.2)
function formatIP(ip) {
    if (ip == null || ip === "") return "";
    const whole = Math.floor(ip);
    const frac = Math.round((ip - whole) * 10);
    return `${whole}.${frac}`;
}

// ===============================
// MAIN LOADER
// ===============================

document.addEventListener("DOMContentLoaded", async () => {
    const playerID = getPlayerID();
    if (!playerID) return;

    let playerName = "";
    let careerHitting = [];
    let careerPitching = [];
    let seasonHitting = [];
    let seasonPitching = [];

    try {
        // Load all CSVs in parallel
        const [
            hittingCareerData,
            pitchingCareerData,
            hittingSeasonData,
            pitchingSeasonData
        ] = await Promise.all([
            loadCSV(HITTING_CAREER_CSV),
            loadCSV(PITCHING_CAREER_CSV),
            loadCSV(HITTING_SEASON_CSV),
            loadCSV(PITCHING_SEASON_CSV)
        ]);

        // Filter by player ID
        careerHitting = hittingCareerData.filter(r => r.player_id == playerID);
        careerPitching = pitchingCareerData.filter(r => r.player_id == playerID);
        seasonHitting = hittingSeasonData.filter(r => r.player_id == playerID);
        seasonPitching = pitchingSeasonData.filter(r => r.player_id == playerID);

        // Get player name
        if (careerHitting.length > 0) {
            playerName = `${careerHitting[0].first_name} ${careerHitting[0].last_name}`;
        } else if (careerPitching.length > 0) {
            playerName = `${careerPitching[0].first_name} ${careerPitching[0].last_name}`;
        } else if (seasonHitting.length > 0) {
            playerName = `${seasonHitting[0].first_name} ${seasonHitting[0].last_name}`;
        } else if (seasonPitching.length > 0) {
            playerName = `${seasonPitching[0].first_name} ${seasonPitching[0].last_name}`;
        }

        document.getElementById("playerName").textContent = playerName;
        document.getElementById("loadingMessage").style.display = "none";

        // ===============================
        // CAREER HITTING TABLE
        // ===============================
        careerHitting.forEach(r => {
            addRow("careerHittingBody", [
                r.AB, r.H, r.R, r.RBI, r["2B"], r["3B"], r.HR, r.AVG
            ]);
        });

        // ===============================
        // CAREER PITCHING TABLE
        // ===============================
        careerPitching.forEach(r => {
            addRow("careerPitchingBody", [
                formatIP(r.IP), r.K, r.W, r.S, r.BB, r.R, r.H, r.ERA, r.WHIP
            ]);
        });

        // ===============================
        // SEASON HITTING TABLE
        // ===============================
        seasonHitting.forEach(r => {
            addRow("seasonHittingBody", [
                r.season, r.AB, r.H, r.R, r.RBI, r["2B"], r["3B"], r.HR, r.AVG
            ]);
        });

        // ===============================
        // SEASON PITCHING TABLE
        // ===============================
        seasonPitching.forEach(r => {
            addRow("seasonPitchingBody", [
                r.season, formatIP(r.IP), r.K, r.W, r.S, r.BB, r.R, r.H, r.ERA, r.WHIP
            ]);
        });

        // ===============================
        // SUMMARY BAR
        // ===============================
        const sumAVG = careerHitting.length ? careerHitting[0].AVG : "–";
        const sumH = careerHitting.length ? careerHitting[0].H : "–";
        const sumIP = careerPitching.length ? formatIP(careerPitching[0].IP) : "–";
        const sumERA = careerPitching.length ? careerPitching[0].ERA : "–";

        document.getElementById("sumAVG").textContent = sumAVG;
        document.getElementById("sumH").textContent = sumH;
        document.getElementById("sumIP").textContent = sumIP;
        document.getElementById("sumERA").textContent = sumERA;

        document.getElementById("careerSummary").style.display = "flex";

    } catch (err) {
        console.error("Error loading player data:", err);
        document.getElementById("loadingMessage").textContent = "Error loading data.";
    }
});
