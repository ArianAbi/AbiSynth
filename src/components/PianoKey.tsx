import { useEffect, useRef } from "react";
import type { NoteConfigType, SynthType } from "../types/Types";

export default function PianoKey({ note, synth }: { note: NoteConfigType, synth: SynthType }) {
    const held = useRef(false)

    function HandleKeydown(e: KeyboardEvent) {
        if (held.current) return

        if (e.key == note.hotkey.toLocaleLowerCase()) {
            held.current = true

            onKeyDown()
        }
    }

    function HandleKeyup(e: KeyboardEvent) {
        if (e.key == note.hotkey.toLocaleLowerCase()) {
            synth.StopOscillator(note.name)
            held.current = false
        }
    }

    useEffect(() => {

        window.addEventListener("keydown", HandleKeydown)
        window.addEventListener("keyup", HandleKeyup)

        return () => {
            window.removeEventListener("keydown", HandleKeydown)
            window.removeEventListener("keyup", HandleKeyup)
        }
    }, [])

    function onKeyDown() {
        if (!synth.isPlaying.get(note.name)) {
            synth.PlayOscillator(note.frequancy, note.name)
        }
    }

    function onKeyUp() {
        synth.StopOscillator(note.name)
    }

    return (
        <button
            onMouseDown={onKeyDown}
            onMouseUp={onKeyUp}
        >
            {note.name + " " + "Key : " + note.hotkey + " " + synth.isPlaying.get(note.name)}
        </button>
    )
}