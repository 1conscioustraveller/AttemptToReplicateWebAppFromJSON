# Project Structure — LoopGo DJ Mixer (React + Vite)

This document explains the overall **file/folder structure**, the role of each part, 
and how responsibilities were divided among LLM delegates in the role-played build process.

---

## 📂 Root Directory

```
dj-mixer-vite/
├── index.html           # Entry HTML (mount point for React)
├── package.json         # Project dependencies & scripts
├── vite.config.js       # Vite configuration (with React plugin)
├── README.md            # General usage instructions
├── STRUCTURE.md         # (this file) Project structure & role descriptions
└── src/                 # React source code
```

---

## 📂 src/

- **main.jsx** — React entrypoint. Renders `<App />` into `#root`.
- **styles.css** — Global and component-level styles. Includes responsive rules (<768px).

### Components (`src/components/`)
- **Deck.jsx**
  - Represents one audio deck (A, B, C, or D).
  - Features:
    - Load audio file or URL.
    - Play/Pause button.
    - Independent Volume control (gain node).
    - Pitch/Speed control (`audio.playbackRate`).
  - Routes its audio through group gain (AB or CD).

- **Crossfader.jsx**
  - Horizontal slider blending between AB group and CD group.
  - Implements **equal-power crossfade curve** for smooth transitions.
  - Displays current blend value (percentage CD).

### Hooks (`src/hooks/`)
- **useMixer.js**
  - Provides `MixerContext` for Web Audio graph management.
  - Lazily initializes `AudioContext` on first user interaction (autoplay policy compliant).
  - Creates:
    - `abGain` (group gain for Decks A & B)
    - `cdGain` (group gain for Decks C & D)
    - `masterGain` (future-proofing)
  - Ensures audio graph: `<audio>` → deck gain → group gain → master → destination.

### App (`src/App.jsx`)
- Wraps everything in `<MixerProvider>` context.
- Layout:
  - **Header** with branding + description.
  - **Grid** with 4 `<Deck>` components (A, B in AB; C, D in CD).
  - **Crossfader** component.
  - **Footer** with usage tip.

---

## 🎭 LLM Delegate Responsibilities (Role-played)

- **Gemini** → Initialize base UI skeleton (React + Vite project setup).
- **Claude** → Implement independent **volume controls** per deck.
- **Llama** → Add **crossfader** (2 failed retries → escalated, fixed with equal-power curve).
- **DeepSeek** → Implement **pitch/speed controls** (playbackRate binding).
- **Flux** → Ensure **mobile-friendly styling** (bigger slider thumbs, responsive grid).
- **ChatGPT5 (Supervisor)** → Reviewed escalated crossfader, verified all steps, signed off final project.

---

## 🔑 Key Design Notes
- **Equal-power crossfader** prevents loudness dips during transitions.
- **Responsive sliders** ensure usability on touch devices.
- **Context-based mixer graph** allows consistent audio routing and future extensibility (effects, master controls).
- **Acceptance criteria** satisfied step-by-step, logged in governance role-play.

---

End of STRUCTURE.md
