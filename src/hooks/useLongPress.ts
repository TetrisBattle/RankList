import { useState, useEffect } from 'react'

const useLongPress = (callback: () => void, ms = 500) => {
	const [startLongPress, setStartLongPress] = useState(false)

	useEffect(() => {
		let timeout: NodeJS.Timeout | undefined

		if (startLongPress) {
			timeout = setTimeout(callback, ms)
		}

		return () => {
			if (timeout) clearTimeout(timeout)
		}
	}, [callback, ms, startLongPress])

	return {
		onMouseDown: () => setStartLongPress(true),
		// onTouchStart: () => setStartLongPress(true),
		onMouseUp: () => setStartLongPress(false),
		// onTouchEnd: () => setStartLongPress(false),
		onMouseLeave: () => setStartLongPress(false),
	}
}

export default useLongPress
