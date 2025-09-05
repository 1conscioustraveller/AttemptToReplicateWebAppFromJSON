import { MixerProvider } from './hooks/useMixer'
import Deck from './components/Deck.jsx'
import Crossfader from './components/Crossfader.jsx'

export default function App(){
  return (
    <MixerProvider>
      <div className="app">
        <header className="header">
          <div className="brand">LoopGo • 4‑Deck Web DJ</div>
          <div className="sub">Per‑deck volume & pitch • AB/CD crossfader • Mobile friendly</div>
        </header>

        <div className="grid">
          <Deck id="A" group="AB" />
          <Deck id="B" group="AB" />
          <Deck id="C" group="CD" />
          <Deck id="D" group="CD" />
        </div>

        <Crossfader />

        <footer>
          Tip: Load local audio files or paste URLs that allow CORS. Playback rate changes pitch & speed.
        </footer>
      </div>
    </MixerProvider>
  )
}
