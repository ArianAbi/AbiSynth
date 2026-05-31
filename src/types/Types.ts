import type useSynth from "../hooks/useSynth"

export interface NoteConfigType {
    name: string,
    hotkey: string,
    frequancy: number,
    isBlackKey: boolean
}

export type SynthType = ReturnType<typeof useSynth>