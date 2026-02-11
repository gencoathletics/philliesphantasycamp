document.addEventListener("DOMContentLoaded", function () {

    Papa.parse("/data/hittingcareer_normalized.csv", {
        download: true,
        header: true,
        complete: function (results) {
    console.log("PARSE RESULT SAMPLE:", results.data.slice(0, 5));
    const data = results.data;

            // Collect unique players using REAL CSV headers
            const players = {};
            data.forEach(row => {
                const id = row["PLAYER ID"];
                const first = row["FIRST NAME"];
                const last = row["LAST NAME"];

                if (id && first && last) {
                    players[id] = {
                        id: id.trim(),
                        first: first.trim(),
                        last: last.trim()
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

            // Anchor-based search fix
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
