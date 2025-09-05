import { useEffect, useRef, useState } from 'react'
import { useMixer } from '../hooks/useMixer'

/**
 * Deck component
 * - Allows choosing a local file or remote URL
 * - Controls: Play/Pause, Volume, Pitch/Speed
 * - Audio route: <audio> -> deckGain -> (groupGain AB or CD) -> master -> destination
 */
export default function Deck({ id, group='AB' }){
  const audioRef = useRef(null)
  const srcNodeRef = useRef(null)
  const deckGainRef = useRef(null)

  const { context, abGain, cdGain, ready } = useMixer()
  const [loaded, setLoaded] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [volume, setVolume] = useState(0.9)
  const [rate, setRate] = useState(1.0)
  const [url, setUrl] = useState('')

  useEffect(()=>{
    if (!ready || !audioRef.current || !context) return

    // Create WebAudio graph for this deck once
    if (!srcNodeRef.current){
      srcNodeRef.current = context.createMediaElementSource(audioRef.current)
      deckGainRef.current = context.createGain()
      deckGainRef.current.gain.value = volume

      // connect to group gain
      const groupGain = group === 'AB' ? abGain : cdGain
      srcNodeRef.current.connect(deckGainRef.current)
      deckGainRef.current.connect(groupGain)
    }
  }, [ready, context, abGain, cdGain, group])

  // update volume
  useEffect(()=>{
    if (deckGainRef.current){
      deckGainRef.current.gain.value = volume
    }
  }, [volume])

  // update playback rate
  useEffect(()=>{
    if (audioRef.current){
      audioRef.current.playbackRate = rate
    }
  }, [rate])

  const onFile = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const objectUrl = URL.createObjectURL(file)
    setUrl(objectUrl)
    setLoaded(false)
  }

  const onUrlApply = () => {
    if (!url) return
    setLoaded(false)
  }

  const toggle = async () => {
    if (!audioRef.current) return
    if (audioRef.current.paused){
      await audioRef.current.play().catch(()=>{})
      setPlaying(true)
    } else {
      audioRef.current.pause()
      setPlaying(false)
    }
  }

  return (
    <div className="panel">
      <div className="deck-title">
        <div>Deck {id} <span className="badge">Group {group}</span></div>
        <div className="small">{loaded ? 'Ready' : 'Load a track'}</div>
      </div>

      <div className="controls">
        <div className="source-input">
          <input
            type="file"
            accept="audio/*"
            onChange={onFile}
            aria-label={`Choose audio file for Deck ${id}`}
          />
          <input
            type="text"
            placeholder="Or paste an audio URL (must allow CORS)"
            value={url}
            onChange={e=>setUrl(e.target.value)}
          />
          <button onClick={onUrlApply}>Load URL</button>
        </div>

        <audio
          ref={audioRef}
          src={url || undefined}
          onCanPlay={()=> setLoaded(true)}
          onEnded={()=> setPlaying(false)}
          preload="auto"
          crossOrigin="anonymous"
        />

        <div className="row">
          <button className="primary" onClick={toggle} disabled={!loaded}>
            {playing ? 'Pause' : 'Play'}
          </button>
          <span className="small">Volume: {(volume*100)|0}%</span>
        </div>

        <div>
          <label htmlFor={`vol-${id}`}>Volume</label>
          <input
            id={`vol-${id}`}
            type="range" min="0" max="1" step="0.01"
            value={volume}
            onChange={e=>setVolume(parseFloat(e.target.value))}
          />
        </div>

        <div>
          <label htmlFor={`rate-${id}`}>Pitch / Speed (Playback Rate)</label>
          <input
            id={`rate-${id}`}
            type="range" min="0.5" max="1.5" step="0.01"
            value={rate}
            onChange={e=>setRate(parseFloat(e.target.value))}
          />
          <div className="small">Current: {rate.toFixed(2)}×</div>
        </div>
      </div>
    </div>
  )
}
