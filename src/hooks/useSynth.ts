import { useEffect, useRef, useState } from "react";
import { NotesConfig } from "../configs/NotesConfig";

let audioCtxInstance: AudioContext | null = null;

export interface OscillatorConfigType {
    id: number,
    type: OscillatorType,
    detune: number,
    enabled: boolean
}

export default function useSynth(attack: number, release: number) {
    if (!audioCtxInstance) {
        audioCtxInstance = new AudioContext();
    }


    const [oscillatorVoices, setOscillatorVoices] = useState<OscillatorConfigType[]>([
        { id: 0, type: 'sine', detune: 0, enabled: true }
    ])

    const activeOscillatorsRefs = useRef<Map<string, OscillatorNode>>(new Map())

    const noteGainNode = useRef<GainNode | null>(null)
    const envelopeGainNode = useRef<GainNode | null>(null)

    const [isPlaying, setIsPlaying] = useState<Map<string, boolean>>(() => {
        const map = new Map()
        NotesConfig.keyMaps.forEach(note => {
            map.set(note.name, false)
        })

        return map
    })

    useEffect(() => {
        if (!audioCtxInstance) return
        if (!envelopeGainNode.current) {
            envelopeGainNode.current = audioCtxInstance.createGain()
            envelopeGainNode.current.gain.value = .01

            envelopeGainNode.current.connect(audioCtxInstance.destination)
        }
    }, [])

    useEffect(() => {
        if (!audioCtxInstance) return

        // handles gain when multiple notes are played at once
        if (!noteGainNode.current) {
            noteGainNode.current = audioCtxInstance.createGain()
        }

        const noteGainValue = 1 / Math.max(activeOscillatorsRefs.current.size, 1)

        noteGainNode.current.gain.value = noteGainValue

    }, [activeOscillatorsRefs.current])

    function PlayOscillator(frequency: number, id: string) {
        if (audioCtxInstance?.state == 'suspended') audioCtxInstance.resume()

        const activeNodes = new Map(activeOscillatorsRefs.current)

        oscillatorVoices.forEach(osc => {
            if (osc.enabled) {
                if (audioCtxInstance && noteGainNode.current && envelopeGainNode.current) {
                    const oscNode = createOscillator(
                        audioCtxInstance,
                        osc,
                        frequency
                    )

                    oscNode.connect(noteGainNode.current)
                    noteGainNode.current.connect(envelopeGainNode.current)

                    const now = audioCtxInstance.currentTime

                    //envelope attack
                    envelopeGainNode.current.gain.cancelScheduledValues(now);
                    envelopeGainNode.current.gain.setValueAtTime(0, now)
                    envelopeGainNode.current.gain.linearRampToValueAtTime(1, now + attack)

                    activeNodes.set(id, oscNode)
                    oscNode.start(audioCtxInstance.currentTime)
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
        if (!audioCtxInstance) return
        if (!envelopeGainNode.current) return

        const currentGain = envelopeGainNode.current.gain.value

        const now = audioCtxInstance.currentTime

        //envelope release
        envelopeGainNode.current.gain.cancelScheduledValues(now);
        envelopeGainNode.current.gain.setValueAtTime(currentGain, now)
        envelopeGainNode.current.gain.linearRampToValueAtTime(0, now + release)

        setTimeout(() => {
            activeOscillatorsRefs.current.get(id)?.stop(audioCtxInstance?.currentTime)
            activeOscillatorsRefs.current.delete(id)
        }, release * 1000);

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

    return oscillator
}