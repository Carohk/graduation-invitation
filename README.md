# Graduation Invitation Website

## Files
- `index.html` — invitation content and form structure
- `style.css` — layout, colours, envelope animation and responsive styling
- `script.js` — envelope interaction, countdown and RSVP submission

## Run locally
Open `index.html` in a browser, or use the Live Server extension in VS Code.

## Publish with Git
From the project folder in PowerShell:

```powershell
git add index.html style.css script.js README.md
git commit -m "Regenerate graduation invitation files"
git push
```

GitHub Pages should remain configured to deploy from the `main` branch and the repository root.

## RSVP note
The form posts to the existing Google Apps Script Web App URL in `script.js`.
When someone selects **No**, the guest-count control is hidden and the form sends `guests=0`.
Check the connected Google Sheet after a test submission to confirm that the Apps Script records zero correctly. If the Apps Script replaces zero with a default value, its server-side handler will need a small matching update.
