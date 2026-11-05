# Into the Woods

An installable, offline-first PWA checklist for the Westminster Woods
**School Programs overnight packing list**.

- Every section from the official list: Gear, Clothing, Medication, Food,
  Toiletries, Optional Extras, and Do Not Bring (checked off as "left at home")
- Progress ring that grows the redwoods as you pack (Optional Extras don't
  count toward 100%)
- Add your own items to any section, collapse sections, hide packed items
- Saves to the device (`localStorage`); works with no signal once loaded
- Redwood theme drawn from the PDF's logo: fern green, redwood bark, trail-map
  cream, a handwritten heading font, and automatic dark mode

## Run locally

```bash
python3 -m http.server 8000
```

Open http://localhost:8000, then use "Install" / "Add to Home Screen".

Any static host works (GitHub Pages included); all paths are relative.
When you change any shell file, bump `VERSION` in `sw.js`.

## Files

| Path | Purpose |
| --- | --- |
| `index.html`, `styles.css`, `app.js` | The app |
| `sw.js` | Service worker (offline cache) |
| `manifest.webmanifest`, `icons/` | Install metadata and icons |
| `img/logo.png`, `img/trees.png` | Logo and redwoods extracted from the PDF |
| `fonts/` | Self-hosted Gochi Hand + Nunito (SIL OFL) |
