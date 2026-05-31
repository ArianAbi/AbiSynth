import type { NoteConfigType } from "../types/Types"

export const NotesConfig = {
    ratio: 2,
    startingOctave: 3,
    keyMaps: [
        {
            "name": "C3",
            "hotkey": "Z",
            "frequancy": 130.81,
            "isBlackKey": false
        },
        {
            "name": "C#3",
            "hotkey": "S",
            "frequancy": 138.59,
            "isBlackKey": true
        },
        {
            "name": "D3",
            "hotkey": "X",
            "frequancy": 146.83,
            "isBlackKey": false
        },
        {
            "name": "D#3",
            "hotkey": "D",
            "frequancy": 155.56,
            "isBlackKey": true
        },
        {
            "name": "E3",
            "hotkey": "C",
            "frequancy": 164.81,
            "isBlackKey": false
        },
        {
            "name": "F3",
            "hotkey": "V",
            "frequancy": 174.61,
            "isBlackKey": false
        },
        {
            "name": "F#3",
            "hotkey": "G",
            "frequancy": 185,
            "isBlackKey": true
        },
        {
            "name": "G3",
            "hotkey": "B",
            "frequancy": 196,
            "isBlackKey": false
        },
        {
            "name": "G#3",
            "hotkey": "H",
            "frequancy": 207.65,
            "isBlackKey": true
        },
        {
            "name": "A3",
            "hotkey": "N",
            "frequancy": 220,
            "isBlackKey": false
        },
        {
            "name": "A#3",
            "hotkey": "J",
            "frequancy": 233.08,
            "isBlackKey": true
        },
        {
            "name": "B3",
            "hotkey": "M",
            "frequancy": 249.94,
            "isBlackKey": false
        }
    ] as NoteConfigType[]
}