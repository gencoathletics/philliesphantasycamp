// Load players from hittingcareer_normalized.csv (contains full roster)
Papa.parse("/philliesphantasycamp/data/hittingcareer_normalized.csv", {
    download: true,
    header: true,
    complete: function(results) {
        const data = results.data;

        // Collect unique players by PLAYERID
        const players = {};
        data.forEach(row => {
            if (row.PLAYERID && row.FIRST && row.LAST) {
                players[row.PLAYERID] = {
                    id: row.PLAYERID,
                    first: row.FIRST,
                    last: row.LAST
                };
            }
        });

        // Convert to array + sort by last name, then first name
        const playerArray = Object.values(players).sort((a, b) => {
            if (a.last === b.last) return a.first.localeCompare(b.first);
            return a.last.localeCompare(b.last);
        });

        // Render list
        const list = document.getElementById("playerList");
        playerArray.forEach(p => {
            const li = document.createElement("li");

            // IMPORTANT: Absolute path for GitHub Pages
            li.innerHTML = `
                <a class="playerLink" 
                   href="/philliesphantasycamp/players/player.html?id=${p.id}">
                   ${p.first} ${p.last}
                </a>
            `;

            list.appendChild(li);
        });

        // Live search filter
        document.getElementById("searchBox").addEventListener("input", function() {
            const term = this.value.toLowerCase();
            const items = list.getElementsByTagName("li");

            for (let i = 0; i < items.length; i++) {
                const text = items[i].innerText.toLowerCase();
                items[i].style.display = text.includes(term) ? "" : "none";
            }
        });
    }
});
