# HF Studio - Interactive Heart Failure Chapter

A self-contained interactive learning website rebuilt from the supplied Heart Failure study chapter.

## Open the website

1. Extract the ZIP archive.
2. Open `index.html` in a recent version of Google Chrome or Microsoft Edge.
3. Internet access is not required for the chapter itself. The DOI reference links require internet access.

For the most consistent browser behavior, the folder can also be served locally:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000`.

## Main features

- Twelve interconnected modules with persistent visited-module progress.
- Detailed coverage of foundations, mechanisms, clinical assessment, diagnosis, chronic treatment, pharmacology, acute heart failure, advanced care, revision, and cases.
- Search across modules, responsive mobile navigation, print support, flashcards, and a 12-question case quiz.
- Interactive EF and NYHA classifiers, Framingham criteria tool, BNP context explorer, HFrEF four-pillar explorer, medicine safety checker, and acute warm/cold-wet/dry decision tools.
- A separate **Listen** button for each compact learning block.

## Text-to-speech

The website uses the browser's built-in Web Speech API and first requests the voice named **Google UK English Female**. When that exact voice is unavailable, it selects the closest available British-English voice. Voice availability depends on the browser and operating system. Google Chrome normally provides the strongest compatibility.

Use the speed selector in the top bar to adjust narration speed. The square Stop button cancels speech immediately.

## Files

- `index.html` - application shell and navigation
- `styles.css` - responsive visual design and print layout
- `app.js` - chapter content, routing, tools, quiz, progress, search, and TTS
- `assets/heart-failure-source.pdf` - supplied source chapter

## Educational scope

This is a study aid. It is not a substitute for patient-specific assessment, prescribing guidance, local protocols, or full current clinical guidelines.


## 2026 unified study upgrade

This archive was standardized to the Rheumatic Fever Lab interaction model. It now includes:

- Persistent light/night mode
- Focus reading mode and adjustable text size
- A categorized Study Hub with active-recall flashcards, spaced-review markers, local notes, and a 25-minute timer
- Reading progress and back-to-top controls
- Universal pause/continue text-to-speech behavior
- Keyboard shortcuts: `S` Study Hub, `D` night mode, `F` focus mode, `/` search
- A flat, portable folder structure: open `index.html`; no server or build step is required

Flashcards summarize material already presented in the learning site. Use the site’s Sources module for references and clinical scope.
