// =========================================
// GRADUATION INVITATION — INTERACTIONS
// =========================================

// Keep the existing Google Apps Script Web App endpoint.
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwwWPvOz8rVnMQfV8wjAhZJeYro0N2SJayqHOBCv4-p6Iwb_QuzEIND6HAecsffXiSX8A/exec";

document.addEventListener("DOMContentLoaded", () => {
    // Envelope opening
    const envelopeScreen = document.getElementById("envelopeScreen");
    const openEnvelopeButton = document.getElementById("openEnvelope");
    const invitationSite = document.getElementById("invitationSite");

    if (openEnvelopeButton && envelopeScreen && invitationSite) {
        openEnvelopeButton.addEventListener("click", () => {
            if (openEnvelopeButton.classList.contains("is-open")) return;

            openEnvelopeButton.classList.add("is-open");
            openEnvelopeButton.setAttribute("aria-expanded", "true");

            window.setTimeout(() => {
                envelopeScreen.classList.add("is-opening");
                invitationSite.classList.remove("is-hidden");
                document.body.style.overflow = "auto";
            }, 850);
        });
    }

    // Countdown to 4 December 2026.
    // Kenya time is UTC+3. This target is midnight at the start of graduation day.
    const graduationDate = new Date("2026-12-04T00:00:00+03:00");

    function updateCountdown() {
        const now = new Date();
        const difference = graduationDate.getTime() - now.getTime();

        const daysElement = document.getElementById("days");
        const hoursElement = document.getElementById("hours");
        const minutesElement = document.getElementById("minutes");
        const secondsElement = document.getElementById("seconds");

        if (!daysElement || !hoursElement || !minutesElement || !secondsElement) return;

        if (difference <= 0) {
            daysElement.textContent = "000";
            hoursElement.textContent = "00";
            minutesElement.textContent = "00";
            secondsElement.textContent = "00";
            return;
        }

        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / (1000 * 60)) % 60);
        const seconds = Math.floor((difference / 1000) % 60);

        daysElement.textContent = String(days).padStart(3, "0");
        hoursElement.textContent = String(hours).padStart(2, "0");
        minutesElement.textContent = String(minutes).padStart(2, "0");
        secondsElement.textContent = String(seconds).padStart(2, "0");
    }

    updateCountdown();
    window.setInterval(updateCountdown, 1000);

    // RSVP form and conditional guest count.
    const rsvpForm = document.getElementById("rsvpForm");
    const formStatus = document.getElementById("formStatus");
    const attendanceSelect = document.getElementById("attendance");
    const guestCountGroup = document.getElementById("guestCountGroup");
    const guestsSelect = document.getElementById("guests");
    const submitButton = rsvpForm?.querySelector('button[type="submit"]');

    function updateGuestField() {
        if (!attendanceSelect || !guestCountGroup || !guestsSelect) return;

        const attending = attendanceSelect.value === "Yes";
        guestCountGroup.hidden = !attending;
        guestsSelect.required = attending;

        if (!attending) {
            guestsSelect.value = "1";
        }
    }

    if (attendanceSelect) {
        attendanceSelect.addEventListener("change", updateGuestField);
        updateGuestField();
    }

    if (rsvpForm && formStatus && attendanceSelect && guestsSelect) {
        rsvpForm.addEventListener("submit", async (event) => {
            event.preventDefault();

            const fullName = document.getElementById("fullName").value.trim();
            const attendance = attendanceSelect.value;
            const message = document.getElementById("message").value.trim();

            if (!fullName || !attendance) {
                showStatus("Please enter your name and select your attendance response.", true);
                return;
            }

            if (attendance === "Yes" && !guestsSelect.value) {
                showStatus("Please select the number of guests.", true);
                return;
            }

            // Guests who cannot attend are submitted as 0.
            const guests = attendance === "Yes" ? guestsSelect.value : "0";

            const formData = new URLSearchParams();
            formData.append("fullName", fullName);
            formData.append("attendance", attendance);
            formData.append("guests", guests);
            formData.append("message", message);

            if (submitButton) {
                submitButton.disabled = true;
                submitButton.textContent = "Submitting...";
            }
            showStatus("Submitting your response…", false);

            try {
                // no-cors is retained for compatibility with the existing Apps Script setup.
                // The browser cannot read the response body in no-cors mode.
                await fetch(GOOGLE_SCRIPT_URL, {
                    method: "POST",
                    mode: "no-cors",
                    body: formData
                });

                showStatus("Thank you. Your RSVP has been sent.", false);
                rsvpForm.reset();
                updateGuestField();
            } catch (error) {
                console.error("RSVP submission error:", error);
                showStatus("Something went wrong. Please try submitting again.", true);
            } finally {
                if (submitButton) {
                    submitButton.disabled = false;
                    submitButton.innerHTML = 'Submit RSVP <span aria-hidden="true">↗</span>';
                }
            }
        });
    }

    function showStatus(message, isError) {
        if (!formStatus) return;
        formStatus.textContent = message;
        formStatus.classList.toggle("error", Boolean(isError));
    }
});
