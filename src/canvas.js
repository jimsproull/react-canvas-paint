export function clearCanvas(canvas) {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

export function drawImageData(canvas, imageData) {
    const ctx = canvas.getContext('2d');
    return ctx.putImageData(imageData, 0, 0);
}

export function getImageData(canvas) {
    const ctx = canvas.getContext('2d');
    return ctx.getImageData(0, 0, canvas.width, canvas.height);
}
