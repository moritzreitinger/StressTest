const canvas = document.getElementById('myCanvas')
const ctx = canvas.getContext('2d')

const WIDTH = 800
const HEIGHT = 600
ctx.canvas.width = WIDTH
ctx.canvas.height = HEIGHT

let worker
let colorPalette = []
let REAL_SET = { start: -2, end: 1 }
let IMAGINARY_SET = { start: -1, end: 1 }
const ZOOM_FACTOR = 0.1
const TASKS = []

const lagrange = ([X1, Y1], [X2, Y2], x) => (((Y1 * (x - X2)) / (X1 - X2)) + ((Y2 * (x - X1)) / (X2 - X1)))

const makeRGB = (r, g, b, k) => {
    const calculate = pair => parseInt(lagrange(pair[0], pair[1], k))
    if (isNaN(r)) r = calculate(r)
    if (isNaN(g)) g = calculate(g)
    if (isNaN(b)) b = calculate(b)

    return [r, g, b]
}
const palette = (size = 250) => {
    const range = parseInt(size / 6)
    const colors = []
    let c
    for (let k = 0; k < size; k++) {
        if (k <= range)
            c = makeRGB(255, [[0, 0], [range, 255]], 0, k)
        else if (k <= range * 2)
            c = makeRGB([[range + 1, 255], [range * 2, 0]], 255, 0, k)
        else if (k <= range * 3)
            c = makeRGB(0, 255, [[range * 2 + 1, 0], [range * 3, 255]], k)
        else if (k <= range * 4)
            c = makeRGB(0, [[range * 3 + 1, 255], [range * 4, 0]], 255, k)
        else if (k <= range * 5)
            c = makeRGB([[range * 4 + 1, 0], [range * 5, 255]], 0, 255, k)
        else
            c = makeRGB(255, 0, [[range * 5 + 1, 255], [size - 1, 0]], k)

        colors.push(c)
    }
    return colors
}
const paletteBW = () => new Array(250).fill(0).map((_, i) => {
    const c = lagrange([0, 0], [250, 255], i)
    return [c, c, c]
})
const start = () => {
    for (let col = 0; col < WIDTH; col++) TASKS[col] = col
    worker.postMessage({ col: TASKS.shift() })
}
const draw = (res) => {
    if (TASKS.length > 0)
        worker.postMessage({ col: TASKS.shift() })

    const { col, mandelbrotSets } = res.data
    for (let i = 0; i < HEIGHT; i++) {
        const [m, isMandelbrotSet] = mandelbrotSets[i]
        c = isMandelbrotSet ? [0, 0, 0] : colorPalette[m % (colorPalette.length - 1)]
        ctx.fillStyle = `rgb(${c[0]}, ${c[1]}, ${c[2]})`
        ctx.fillRect(col, i, 1, 1)
    }
}
const init = () => {
    if (worker) worker.terminate()
    worker = new Worker('worker.js')
    worker.postMessage({ w: WIDTH, h: HEIGHT, realSet: REAL_SET, imaginarySet: IMAGINARY_SET, isSettingUp: true })
    start()
    colorPalette = palette()
    worker.onmessage = draw
}
const zoomIn = () => {
    const zfw = (WIDTH * ZOOM_FACTOR)
    const zfh = (HEIGHT * ZOOM_FACTOR)

    REAL_SET = {
        start: REAL_SET.start + ZOOM_FACTOR,
        end: REAL_SET.end - ZOOM_FACTOR
    }
    IMAGINARY_SET = {
        start: IMAGINARY_SET.start + ZOOM_FACTOR,
        end: IMAGINARY_SET.end - ZOOM_FACTOR
    }
    init()
    setInterval(zoomIn, 10000);
}
const getRelativePoint = (pixel, length, set) => set.start + (pixel / length) * (set.end - set.start)
init()