import { useRef, useState } from "react";

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

    const oscillatorsRefs = useRef<OscillatorNode[]>([])

    const [isPlaying, setIsPlaying] = useState(false)

    function PlayOscillators() {
        if (isPlaying) return
        if (audioCtxInstance?.state == 'suspended') audioCtxInstance.resume()

        const nodes: OscillatorNode[] = []

        oscillators.forEach(osc => {
            if (osc.enabled) {
                if (audioCtxInstance) {
                    const node = createOscillator(audioCtxInstance, osc, 440)
                    nodes.push(node)
                    node.start(audioCtxInstance.currentTime)
                }
            }
        })

        oscillatorsRefs.current = nodes
        setIsPlaying(true)
    }

    function StopOscillators() {
        if (!isPlaying) return

        oscillatorsRefs.current.forEach(osc => {
            try {
                osc.stop(audioCtxInstance?.currentTime)
            } catch (err) {
                console.log(err);
            }
        })

        oscillatorsRefs.current = []
        setIsPlaying(false)
    }


    return {
        audioCtx: audioCtxInstance,
        PlayOscillators,
        StopOscillators,
        isPlaying
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