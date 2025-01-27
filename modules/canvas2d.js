// inspired by https://arkenfox.github.io/TZP/tests/canvasnoise.html
const getPixelMods = () => {
	const pattern1 = []
	const pattern2 = []
	const len = 20 // canvas dimensions
	const alpha = 255

	try {
		// create 2 canvas contexts
		const canvas1 = document.createElement('canvas')
		const canvas2 = document.createElement('canvas')
		const context1 = canvas1.getContext('2d')
		const context2 = canvas2.getContext('2d')

		// set the dimensions
		canvas1.width = len
		canvas1.height = len
		canvas2.width = len
		canvas2.height = len

		// fill canvas1 with random image data
		;[...Array(len)].forEach((e, x) => [...Array(len)].forEach((e, y) => {
			const red = ~~(Math.random() * 256)
			const green = ~~(Math.random() * 256)
			const blue = ~~(Math.random() * 256)
			const colors = `${red}, ${green}, ${blue}, ${alpha}`
			context1.fillStyle = `rgba(${colors})`
			context1.fillRect(x, y, 1, 1)
			pattern1.push(colors) // collect the pixel pattern
		}))

		// fill canvas2 with canvas1 image data
		;[...Array(len)].forEach((e, x) => [...Array(len)].forEach((e, y) => {
			const pixel = context1.getImageData(x, y, 1, 1)
			const red = pixel.data[0]
			const green = pixel.data[1]
			const blue = pixel.data[2]
			const alpha = pixel.data[3]
			const colors = `${red}, ${green}, ${blue}, ${alpha}`
			context2.fillStyle = `rgba(${colors})`
			context2.fillRect(x, y, 1, 1)
			return pattern2.push(colors) // collect the pixel pattern
		}))

		// compare the pattern collections and collect diffs
		const patternDiffs = []
		const rgbaChannels = new Set()
		;[...Array(pattern1.length)].forEach((e, i) => {
			const pixelColor1 = pattern1[i]
			const pixelColor2 = pattern2[i]
			if (pixelColor1 != pixelColor2) {
				const rgbaValues1 = pixelColor1.split(',')
				const rgbaValues2 = pixelColor2.split(',')
				const colors = [
					rgbaValues1[0] != rgbaValues2[0] ? 'r' : '',
					rgbaValues1[1] != rgbaValues2[1] ? 'g' : '',
					rgbaValues1[2] != rgbaValues2[2] ? 'b' : '',
					rgbaValues1[3] != rgbaValues2[3] ? 'a' : ''
				].join('')
				rgbaChannels.add(colors)
				patternDiffs.push([i, colors])
			}
		})

		const rgba = rgbaChannels.size ? [...rgbaChannels].sort().join(', ') : undefined
		const pixels = patternDiffs.length || undefined
		return { rgba, pixels }
	}
	catch (error) {
		console.error(error)
		return
	}
}

export const getCanvas2d = async imports => {
	
	const {
		require: {
			hashMini,
			captureError,
			lieProps,
			documentLie,
			phantomDarkness,
			dragonOfDeath,
			logTestResult
		}
	} = imports
	
	try {
		const start = performance.now()
		const dataLie = lieProps['HTMLCanvasElement.toDataURL']
		const contextLie = lieProps['HTMLCanvasElement.getContext']
		let lied = (dataLie || contextLie) || false
		const doc = phantomDarkness ? phantomDarkness.document : document
		const canvas = doc.createElement('canvas')
		const context = canvas.getContext('2d')
		const str = '!😃🙌🧠👩‍💻👟👧🏻👩🏻‍🦱👩🏻‍🦰👱🏻‍♀️👩🏻‍🦳👧🏼👧🏽👧🏾👧🏿🦄🐉🌊🍧🏄‍♀️🌠🔮♞'
		context.font = '14px Arial'
		context.fillText(str, 0, 50)
		context.fillStyle = 'rgba(100, 200, 99, 0.78)'
		context.fillRect(100, 30, 80, 50)
		const dataURI = canvas.toDataURL()
		if (dragonOfDeath) {
			const result1 = dragonOfDeath.document.createElement('canvas').toDataURL()
			const result2 = document.createElement('canvas').toDataURL()
			if (result1 != result2) {
				lied = true
				const iframeLie = `expected x in nested iframe and got y`
				documentLie(`HTMLCanvasElement.toDataURL`, iframeLie)
			}
		}
		const mods = getPixelMods()
		if (mods && mods.pixels) {
			lied = true
			const iframeLie = `pixel data modified`
			documentLie(`CanvasRenderingContext2D.getImageData`, iframeLie)
		}
		logTestResult({ start, test: 'canvas 2d', passed: true })
		return { dataURI, mods, lied }
	}
	catch (error) {
		logTestResult({ test: 'canvas 2d', passed: false })
		captureError(error)
		return
	}
}