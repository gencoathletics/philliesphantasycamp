document.addEventListener("DOMContentLoaded", function () {

    Papa.parse("/philliesphantasycamp/data/standings2027.csv", {
        download: true,
        header: true,
        complete: function(results) {

            const data = results.data.filter(row => row.TEAM);

            const gillick = data
                .filter(row => row.DIVISION === "Gillick")
                .sort((a,b) => Number(b.PTS) - Number(a.PTS));

            const owens = data
                .filter(row => row.DIVISION === "Owens")
                .sort((a,b) => Number(b.PTS) - Number(a.PTS));

            buildTable("gillickTable", gillick);
            buildTable("owensTable", owens);
            buildMatchups(gillick, owens);
        }
    });

    function buildTable(tableId, teams) {

        const tbody =
            document.querySelector(`#${tableId} tbody`);

        teams.forEach((team, index) => {

            const tr = document.createElement("tr");

            tr.innerHTML = `
                <td>${index + 1}</td>
                <td>${team.TEAM}</td>
                <td>${team.W}</td>
                <td>${team.L}</td>
                <td>${team.T}</td>
                <td>${team.PTS}</td>
                <td>${team.RS}</td>
                <td>${team.RA}</td>
            `;

            tbody.appendChild(tr);
        });

        $(`#${tableId}`).DataTable({
            paging: false,
            searching: false,
            info: false
        });
    }

    function buildMatchups(gillick, owens) {

        const div = document.getElementById("matchups");

        if (gillick.length !== 6 || owens.length !== 6) {
            return;
        }

        div.innerHTML = `
            <h3>🏆 Championship Game</h3>
            <p>${gillick[0].TEAM} vs ${owens[0].TEAM}</p>

            <h3>🥉 3rd Place Game</h3>
            <p>${gillick[1].TEAM} vs ${owens[1].TEAM}</p>

            <h3>5th Place Game</h3>
            <p>${gillick[2].TEAM} vs ${owens[2].TEAM}</p>

            <h3>7th Place Game</h3>
            <p>${gillick[3].TEAM} vs ${owens[3].TEAM}</p>

            <h3>9th Place Game</h3>
            <p>${gillick[4].TEAM} vs ${owens[4].TEAM}</p>

            <h3>11th Place Game</h3>
            <p>${gillick[5].TEAM} vs ${owens[5].TEAM}</p>
        `;
    }
});
