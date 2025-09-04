# LoopGo • 4‑Deck Web DJ (React + Vite)

Features:
- Four decks (A,B in group AB; C,D in group CD)
- Per‑deck **Volume** and **Pitch/Speed** (playbackRate)
- **Crossfader** AB ⇄ CD using equal‑power curve
- Mobile‑friendly sliders and hit targets (<768px)

## Quick Start
```bash
npm i
npm run dev
```
Then open the shown localhost URL.

Load **local audio files** (drag a file with the file picker) or paste a **direct audio URL** that allows CORS.
Playback rate changes both pitch and speed (HTML5).

## Architecture
- Web Audio graph:
  - `<audio>` -> `MediaElementSource` -> `deckGain` -> `groupGain (AB/CD)` -> `master` -> `destination`
- Crossfader sets gains of AB and CD using equal‑power law.
- Volume slider updates `deckGain.gain.value`.
- Pitch/Speed updates `<audio>.playbackRate`.

## Acceptance Criteria Mapping
- Base React app runs with Vite ✅
- Independent **volume** per channel ✅
- **Crossfader** un/mutes correctly and transitions smoothly ✅
- **Pitch/Speed** reflects in UI and audio ✅
- Mobile touch size improvements for sliders and crossfader ✅

## Notes
- For remote URLs, ensure CORS is permitted by the host.
- If audio is silent on first interaction, tap/click to resume AudioContext (autoplay policy).
