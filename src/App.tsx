import useSynth from "./hooks/useSynth"
import { NotesConfig } from "./configs/NotesConfig"
import PianoKey from "./components/PianoKey"


function App() {
  const synth = useSynth()

  return (
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
  )
}

export default App
