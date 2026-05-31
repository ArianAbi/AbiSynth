import { useEffect, useRef, useState } from "react";
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


    const [oscillatorVoices, setOscillatorVoices] = useState<OscillatorConfigType[]>([
        { id: 0, type: 'sine', detune: 0, enabled: true }
    ])

    const activeOscillatorsRefs = useRef<Map<string, OscillatorNode>>(new Map())

    const totalGainAmount = useRef(1)

    const [isPlaying, setIsPlaying] = useState<Map<string, boolean>>(() => {
        const map = new Map()
        NotesConfig.keyMaps.forEach(note => {
            map.set(note.name, false)
        })

        return map
    })


    useEffect(() => {
        console.log(activeOscillatorsRefs.current);

    }, [activeOscillatorsRefs.current])

    function PlayOscillator(frequency: number, id: string) {
        if (audioCtxInstance?.state == 'suspended') audioCtxInstance.resume()

        const activeNodes = new Map(activeOscillatorsRefs.current)

        oscillatorVoices.forEach(osc => {
            if (osc.enabled) {
                if (audioCtxInstance) {
                    const node = createOscillator(audioCtxInstance, osc, frequency, totalGainAmount.current)
                    activeNodes.set(id, node)
                    node.start(audioCtxInstance.currentTime)
                }
            }
        })

        activeOscillatorsRefs.current = activeNodes

        setIsPlaying(prev => {
            const newMap = new Map(prev)
            newMap.set(id, true)

            return newMap
        })
    }

    function StopOscillator(id: string) {
        // if (!isPlaying) return
        // if (!isPlaying.current) return

        activeOscillatorsRefs.current.get(id)?.stop(audioCtxInstance?.currentTime)
        activeOscillatorsRefs.current.delete(id)

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

function createOscillator(audioCtx: AudioContext, config: OscillatorConfigType, frequency: number, gainAmount: number) {
    const gain = audioCtx.createGain()
    gain.gain.value = gainAmount

    const oscillator = audioCtx.createOscillator()
    oscillator.type = config.type
    oscillator.frequency.setValueAtTime(frequency, audioCtx.currentTime)
    oscillator.detune.setValueAtTime(config.detune, audioCtx.currentTime)


    oscillator.connect(gain)
    gain.connect(audioCtx.destination)

    return oscillator
}