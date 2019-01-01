import { clearCanvas } from './canvas';

export function drawLine(canvas, drawPoints, color, brushWidth) {
    const ctx = canvas.getContext('2d');
    ctx.beginPath();

    let strokeStyle = color;
    const lastPosition = drawPoints[drawPoints.length - 2];
    ctx.moveTo(lastPosition.x, lastPosition.y);

    ctx.lineWidth = brushWidth;
    ctx.strokeStyle = strokeStyle;
    ctx.lineTo(
        drawPoints[drawPoints.length - 1].x,
        drawPoints[drawPoints.length - 1].y
    );
    ctx.stroke();
}

export function drawBrush(canvas, drawPoints, color, brushWidth) {
    clearCanvas(canvas);

    const ctx = canvas.getContext('2d');
    ctx.lineWidth = brushWidth;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.strokeStyle = color;

    let p1 = drawPoints[0];
    let p2 = drawPoints[1];
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    for (let i = 1, len = drawPoints.length; i < len; i++) {
        const middle = midPoint(p1, p2);
        ctx.quadraticCurveTo(p1.x, p1.y, middle.x, middle.y);
        p1 = drawPoints[i];
        p2 = drawPoints[i + 1];
    }
    ctx.lineTo(p1.x, p1.y);
    ctx.stroke();
}

export function getMousePos(canvas, clientX, clientY) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: (clientX - rect.left) * (canvas.width / rect.width),
        y: (clientY - rect.top) * (canvas.height / rect.height)
    };
}

function midPoint(p1, p2) {
    return {
        x: p1.x + (p2.x - p1.x) / 2,
        y: p1.y + (p2.y - p1.y) / 2
    };
}
