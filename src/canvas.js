export function clearCanvas(canvas) {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

export function getTempCanvasFor(canvas, init) {
    if (init && !canvas._tmpCanvas) {
        canvas._tmpCanvas = cloneCanvas(canvas);
        canvas.parentNode.insertBefore(canvas._tmpCanvas, canvas.nextSibling);
    }
    return canvas._tmpCanvas;
}

export function removeTempCanvasFor(canvas) {
    const tmpCanvas = getTempCanvasFor(canvas);
    tmpCanvas && tmpCanvas.remove();
    canvas._tmpCanvas = null;
}

function cloneCanvas(oldCanvas) {
    const newCanvas = document.createElement('canvas');
    newCanvas.setAttribute(
        'style',
        'pointer-events:none; position:absolute; top: 0px; left: 0px;'
    );

    const context = newCanvas.getContext('2d');
    newCanvas.width = oldCanvas.width;
    newCanvas.height = oldCanvas.height;

    context.drawImage(oldCanvas, 0, 0);
    return newCanvas;
}
