import useSynth from "./hooks/useSynth"


function App() {
  const synth = useSynth()

  return (
    <div>
      <h1>AbiSynth</h1>

      <button onClick={() => {
        if (synth.isPlaying) {
          console.log("im called - stop");

          synth.StopOscillators()
        } else {
          console.log("im called - start");

          synth.PlayOscillators()
        }
      }}>
        {!synth.isPlaying ? "Make a Sound" : "Stop"}
      </button>
    </div>
  )
}

export default App
