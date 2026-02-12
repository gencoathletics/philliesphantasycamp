// Load the shared navigation bar into the #navbar placeholder
document.addEventListener("DOMContentLoaded", function () {
    const navTarget = document.getElementById("navbar");
    if (navTarget) {
        fetch("/philliesphantasycamp/nav.html")
            .then(response => response.text())
            .then(html => {
                navTarget.innerHTML = html;
            })
            .catch(err => console.error("Navigation load error:", err));
    }
});
