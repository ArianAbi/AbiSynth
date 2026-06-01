import useSynth from "./hooks/useSynth"
import { NotesConfig } from "./configs/NotesConfig"
import PianoKey from "./components/PianoKey"
import { useState } from "react"
import useInterpolate from "./hooks/useInterpolate"


function App() {
  const synthAttack = 1
  const synthRelease = 1
  const synth = useSynth(
    synthAttack,
    synthRelease
  )
  const lerp = useInterpolate()

  const [value, setValue] = useState(5)

  return (
    <>
      <div>
        <h1>AbiSynth</h1>

        {NotesConfig.keyMaps.map((note, _i) => {
          return (
            <PianoKey
              note={note}
              synth={synth}
              key={_i}
            />
          )
        })
        }
      </div>

      <div>
        <h1>Lerp Test</h1>

        <div>Value = {value}</div>

        <button
          onClick={() => {
            lerp(5, 12, 2500, (value) => {
              setValue(value)
            })
          }}
        >
          lerp in 500ms
        </button>
      </div>
    </>
  )
}

export default App
