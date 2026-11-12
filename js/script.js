
// ==========================
// GRADUATION COUNTDOWN
// ==========================

// Graduation date: 4 December 2026
const graduationDate = new Date("2026-12-04T00:00:00+03:00").getTime();

function updateCountdown() {

    const now = new Date().getTime();

    const difference = graduationDate - now;

    if (difference <= 0) {
        document.getElementById("countdown").innerHTML =
            "<h3>The celebration day is here! 🎓</h3>";
        return;
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));

    const hours = Math.floor(
        (difference % (1000 * 60 * 60 * 24)) /
        (1000 * 60 * 60)
    );

    const minutes = Math.floor(
        (difference % (1000 * 60 * 60)) /
        (1000 * 60)
    );

    const seconds = Math.floor(
        (difference % (1000 * 60)) / 1000
    );

    document.getElementById("days").textContent =
        String(days).padStart(2, "0");

    document.getElementById("hours").textContent =
        String(hours).padStart(2, "0");

    document.getElementById("minutes").textContent =
        String(minutes).padStart(2, "0");

    document.getElementById("seconds").textContent =
        String(seconds).padStart(2, "0");
}

// Run immediately
updateCountdown();

// Update every second
setInterval(updateCountdown, 1000);
