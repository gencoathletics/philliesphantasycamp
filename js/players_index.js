document.addEventListener("DOMContentLoaded", function () {

    Papa.parse("/philliesphantasycamp/data/hittingcareer_normalized.csv", {
        download: true,
        header: true,
        complete: function (results) {

            const data = results.data;

            // Collect unique players
            const players = {};
            data.forEach(row => {
                if (row["PLAYER ID"] && row["FIRST NAME"] && row["LAST NAME"]) {
                    players[row["PLAYER ID"]] = {
                        id: row["PLAYER ID"],
                        first: row["FIRST NAME"].trim(),
                        last: row["LAST NAME"].trim()
                    };
                }
            });

            // Convert to array + sort
            const list = Object.values(players).sort((a, b) => {
                if (a.last === b.last) return a.first.localeCompare(b.first);
                return a.last.localeCompare(b.last);
            });

            const ul = document.getElementById("playerList");

            list.forEach(p => {
                const li = document.createElement("li");
                li.innerHTML = `
                    <a class="playerLink"
                       href="/philliesphantasycamp/players/player.html?id=${p.id}">
                       ${p.first} ${p.last}
                    </a>`;
                ul.appendChild(li);
            });

            // Live search
            const searchBox = document.getElementById("searchBox");
            searchBox.addEventListener("input", function () {
                const term = this.value.toLowerCase();
                const items = ul.getElementsByTagName("li");

                for (let i = 0; i < items.length; i++) {
                    const text = items[i].innerText.toLowerCase();
                    items[i].style.display = text.includes(term) ? "" : "none";
                }
            });
        }
    });

});
