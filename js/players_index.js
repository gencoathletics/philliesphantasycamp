document.addEventListener("DOMContentLoaded", function () {

    Papa.parse("/philliesphantasycamp/data/hittingcareer_normalized.csv", {
        download: true,
        header: true,
        complete: function (results) {
            const data = results.data;

            // Collect unique players by PLAYERID
            const players = {};
            data.forEach(row => {
                if (row.PLAYERID && row.FIRST && row.LAST) {
                    players[row.PLAYERID] = {
                        id: row.PLAYERID,
                        first: row.FIRST.trim(),
                        last: row.LAST.trim()
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

                li.innerHTML = `
                    <a class="playerLink"
                       href="/philliesphantasycamp/players/player.html?id=${p.id}">
                       ${p.first} ${p.last}
                    </a>
                `;

                list.appendChild(li);
            });

            // ⭐ Anchor-based search fix
            document.getElementById("searchBox").addEventListener("input", function () {
                const term = this.value.toLowerCase().trim();
                const items = list.getElementsByTagName("li");

                for (let i = 0; i < items.length; i++) {
                    const link = items[i].querySelector("a");
                    const text = link.textContent.toLowerCase().trim();
                    items[i].style.display = text.includes(term) ? "" : "none";
                }
            });
        }
    });

});
