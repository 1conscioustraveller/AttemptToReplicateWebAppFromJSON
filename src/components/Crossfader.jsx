import { useEffect, useState } from 'react'
import { useMixer } from '../hooks/useMixer'

/**
 * Crossfader blends AB and CD groups.
 * value: 0 => full AB, 1 => full CD
 * Uses equal-power crossfade curve to avoid dip in perceived loudness.
 */
export default function Crossfader(){
  const { context, abGain, cdGain, ready } = useMixer()
  const [value, setValue] = useState(0.5)

  useEffect(()=>{
    if (!ready || !context) return
    apply(value)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, context])

  const apply = (v) => {
    setValue(v)
    if (!abGain || !cdGain) return

    // equal-power crossfade
    // map v (0..1) to gains via cosine/sine law
    const gainAB = Math.cos(v * Math.PI * 0.5)
    const gainCD = Math.sin(v * Math.PI * 0.5)

    abGain.gain.setTargetAtTime(gainAB, 0, 0.01)
    cdGain.gain.setTargetAtTime(gainCD, 0, 0.01)
  }

  return (
    <div className="panel crossfader">
      <div className="deck-title">
        <div>Crossfader</div>
        <div className="small">AB ⇄ CD</div>
      </div>
      <input
        aria-label="Crossfader AB to CD"
        type="range"
        min="0" max="1" step="0.001"
        value={value}
        onChange={(e)=>apply(parseFloat(e.target.value))}
      />
      <div className="row" style={{justifyContent:'space-between'}}>
        <span className="small">AB</span>
        <span className="small">{(value*100)|0}% CD</span>
      </div>
    </div>
  )
}
