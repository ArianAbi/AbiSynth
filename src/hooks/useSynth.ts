import { useRef, useState } from "react";
import { NotesConfig } from "../configs/NotesConfig";

let audioCtxInstance: AudioContext | null = null;

export interface OscillatorConfigType {
    id: number,
    type: OscillatorType,
    detune: number,
    enabled: boolean
}

export default function useSynth() {
    if (!audioCtxInstance) {
        audioCtxInstance = new AudioContext();
    }

    const [oscillators, setOscillators] = useState<OscillatorConfigType[]>([
        { id: 0, type: 'sine', detune: 0, enabled: true }
    ])

    const oscillatorsRefs = useRef<{ node: OscillatorNode, id: string }[]>([])

    const [isPlaying, setIsPlaying] = useState<Map<string, boolean>>(() => {
        const map = new Map()
        NotesConfig.keyMaps.forEach(note => {
            map.set(note.name, false)
        })

        return map
    })

    function PlayOscillator(frequency: number, id: string) {
        if (audioCtxInstance?.state == 'suspended') audioCtxInstance.resume()

        const nodes: { node: OscillatorNode, id: string }[] = []

        oscillators.forEach(osc => {
            if (osc.enabled) {
                if (audioCtxInstance) {
                    const node = createOscillator(audioCtxInstance, osc, frequency)
                    nodes.push({ node, id })
                    node.start(audioCtxInstance.currentTime)
                }
            }
        })

        oscillatorsRefs.current = nodes
        setIsPlaying(prev => {
            const newMap = new Map(prev)
            newMap.set(id, true)

            return newMap
        })
    }

    function StopOscillator(id: string) {
        // if (!isPlaying) return
        // if (!isPlaying.current) return

        oscillatorsRefs.current.forEach(osc => {
            if (osc.id == id) {
                try {
                    osc.node.stop(audioCtxInstance?.currentTime)
                } catch (err) {
                    console.log(err);
                }
            }
        })

        oscillatorsRefs.current = []
        setIsPlaying(prev => {
            const newMap = new Map(prev)
            newMap.set(id, false)

            return newMap
        })
    }


    return {
        audioCtx: audioCtxInstance,
        PlayOscillator,
        StopOscillator,
        isPlaying: isPlaying
    }
}

function createOscillator(audioCtx: AudioContext, config: OscillatorConfigType, frequency: number) {
    const oscillator = audioCtx.createOscillator()
    oscillator.type = config.type
    oscillator.frequency.setValueAtTime(frequency, audioCtx.currentTime)
    oscillator.detune.setValueAtTime(config.detune, audioCtx.currentTime)
    oscillator.connect(audioCtx.destination)

    return oscillator
}