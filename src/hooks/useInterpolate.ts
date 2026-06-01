import { useEffect, useRef } from "react";

export default function useInterpolate() {
    const instanceRef = useRef<number | null>(null)

    function lerp(start: number, end: number, duration: number, onUpdate: (value: number) => void) {

        const startTime = performance.now()

        function interpolate(now: number) {
            const t = Math.min((now - startTime) / duration, 1)

            onUpdate(start + (end - start) * t)

            if (t < 1) instanceRef.current = requestAnimationFrame(interpolate)
            else onUpdate(end)
        }

        requestAnimationFrame(interpolate)
    }

    useEffect(() => {
        return () => {
            instanceRef.current && cancelAnimationFrame(instanceRef.current)
        }
    }, [])

    return lerp
}