
// =========================================
// GRADUATION WEBSITE JAVASCRIPT
// =========================================


// =========================================
// 1. ENVELOPE OPENING
// =========================================

const envelopeScreen = document.getElementById("envelopeScreen");

const openEnvelope = document.getElementById("openEnvelope");

const invitationSite = document.getElementById("invitationSite");


if (envelopeScreen && openEnvelope && invitationSite) {

    openEnvelope.addEventListener("click", function () {

        // Prevent multiple clicks
        if (envelopeScreen.classList.contains("opening")) {
            return;
        }

        // Start envelope animation
        envelopeScreen.classList.add("opening");

        openEnvelope.disabled = true;

        // Reveal the main website after the envelope opens
        setTimeout(function () {

            invitationSite.classList.remove("is-hidden");

            envelopeScreen.classList.add("closing");

            envelopeScreen.setAttribute("aria-hidden", "true");

            window.scrollTo({
                top: 0,
                behavior: "instant"
            });

        }, 1300);


        // Remove the envelope from the screen
        setTimeout(function () {

            envelopeScreen.remove();

        }, 2400);

    });

}



// =========================================
// 2. GRADUATION COUNTDOWN
// =========================================

const graduationDate = new Date(
    "2026-12-04T00:00:00+03:00"
).getTime();


function updateCountdown() {

    const now = new Date().getTime();

    const difference = graduationDate - now;


    const daysElement = document.getElementById("days");
    const hoursElement = document.getElementById("hours");
    const minutesElement = document.getElementById("minutes");
    const secondsElement = document.getElementById("seconds");


    if (
        !daysElement ||
        !hoursElement ||
        !minutesElement ||
        !secondsElement
    ) {
        return;
    }


    if (difference <= 0) {

        daysElement.textContent = "000";
        hoursElement.textContent = "00";
        minutesElement.textContent = "00";
        secondsElement.textContent = "00";

        return;

    }


    const days = Math.floor(
        difference / (1000 * 60 * 60 * 24)
    );

    const hours = Math.floor(
        (difference % (1000 * 60 * 60 * 24)) /
        (1000 * 60 * 60)
    );

    const minutes = Math.floor(
        (difference % (1000 * 60 * 60)) /
        (1000 * 60)
    );

    const seconds = Math.floor(
        (difference % (1000 * 60)) /
        1000
    );


    daysElement.textContent = String(days).padStart(3, "0");

    hoursElement.textContent = String(hours).padStart(2, "0");

    minutesElement.textContent = String(minutes).padStart(2, "0");

    secondsElement.textContent = String(seconds).padStart(2, "0");

}


// Start countdown
updateCountdown();

setInterval(updateCountdown, 1000);




// =========================================
// 3. RSVP FORM - GOOGLE SHEETS CONNECTION
// =========================================


// Paste your deployed Apps Script Web App URL here.

const GOOGLE_SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbwwWPvOz8rVnMQfV8wjAhZJeYro0N2SJayqHOBCv4-p6Iwb_QuzEIND6HAecsffXiSX8A/exec";


const rsvpForm = document.getElementById("rsvpForm");

const formStatus = document.getElementById("formStatus");


if (rsvpForm && formStatus) {

    rsvpForm.addEventListener("submit", async function (event) {

        event.preventDefault();


        // Collect form information
        const fullName =
            document.getElementById("fullName").value.trim();

        const attendance =
            document.getElementById("attendance").value;

        const guests =
            document.getElementById("guests").value;

        const message =
            document.getElementById("message").value.trim();


        // Basic validation
        if (!fullName || !attendance) {

            formStatus.textContent =
                "Please complete all required fields.";

            return;

        }


        // Check that the Apps Script URL has been entered
        if (!GOOGLE_SCRIPT_URL.startsWith(
            "https://script.google.com/macros/s/"
        )) {

            formStatus.textContent =
                "The RSVP system has not been configured yet.";

            return;

        }


        // Prepare submission
        const formData = new URLSearchParams();

        formData.append("fullName", fullName);

        formData.append("attendance", attendance);

        formData.append("guests", guests);

        formData.append("message", message);


        // Disable the button while submitting
        const submitButton =
            rsvpForm.querySelector('button[type="submit"]');

        submitButton.disabled = true;

        submitButton.textContent = "Submitting...";

        formStatus.textContent = "Sending your RSVP...";


        try {

            /*
             * no-cors avoids a browser CORS preflight.
             * The response is opaque, so the browser cannot
             * read the server's success/error message.
             */

            await fetch(GOOGLE_SCRIPT_URL, {

                method: "POST",

                mode: "no-cors",

                body: formData

            });


            formStatus.textContent =
                "Your RSVP has been sent. Thank you for responding!";


            rsvpForm.reset();


        } catch (error) {

            console.error("RSVP submission error:", error);

            formStatus.textContent =
                "We could not send your RSVP. Please try again.";


        } finally {

            submitButton.disabled = false;

            submitButton.innerHTML =
                'Submit RSVP <span>↗</span>';

        }

    });

}
