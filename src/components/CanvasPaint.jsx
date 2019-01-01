import React, { useState, useEffect, useRef } from 'react';
import { CanvasPaint as styles } from './CanvasPaint.css';
import PropTypes from 'prop-types';

const PENCIL = 'pencil';
const BRUSH = 'brush';
const ERASER = 'eraser';

const CLEAR = 'clear';
const DRAW = 'draw';
export const MODES = {
    CLEAR,
    DRAW
};
export const BRUSHES = {
    PENCIL,
    BRUSH,
    ERASER
};

const CanvasPaint = ({
    brushType,
    brushWidth,
    color,
    width = '400px',
    height = '400px',
    mode
}) => {
    const [isDrawing, setIsDrawing] = useState(false);
    const [lastMode, setLastMode] = useState(mode);
    const [drawPoints, setDrawPoints] = useState([]);
    const canvasRef = useRef(null);
    useEffect(() => {
        if (mode != lastMode && canvasRef.current) {
            if (mode == CLEAR) {
                clearCanvas(canvasRef.current);
            }
            setLastMode(mode);
        }
    });
    return (
        <canvas
            className={styles}
            ref={canvasRef}
            width={width}
            height={height}
            onMouseDown={e => {
                setIsDrawing(true);
                onMouseDown(e, setDrawPoints);
            }}
            onMouseMove={e => {
                if (isDrawing) {
                    const currentPosition = getMousePos(
                        canvasRef.current,
                        e.clientX,
                        e.clientY
                    );
                    onMouseMove(
                        e.target,
                        drawPoints,
                        brushType,
                        brushWidth,
                        color
                    );

                    setDrawPoints([...drawPoints, currentPosition]);
                }
            }}
            onMouseUp={e => {
                setIsDrawing(false);
                onMouseUp(e);
                setDrawPoints([]);
            }}
        />
    );
};

CanvasPaint.propTypes = {
    clear: PropTypes.bool,
    brushType: PropTypes.oneOf(Object.values(BRUSHES)),
    color: PropTypes.string,
    width: PropTypes.string,
    height: PropTypes.string,
    mode: PropTypes.oneOf(Object.values(MODES)),
    brushWidth: PropTypes.number
};

CanvasPaint.defaultProps = {
    brushType: BRUSH,
    brushWidth: 10,
    color: 'black',
    width: '400px',
    height: '400px'
};

function clearCanvas(canvas) {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function onMouseDown(e, setDrawPoints) {
    setDrawPoints([getMousePos(e.target, e.clientX, e.clientY)]);
}

function onMouseUp(e) {
    const tmpCanvas = getTempCanvasFor(e.target);
    if (tmpCanvas) {
        const ctx = e.target.getContext('2d');
        ctx.drawImage(tmpCanvas, 0, 0);
        removeTempCanvasFor(e.target);
    }
}

function getTempCanvasFor(canvas, init) {
    if (init && !canvas._tmpCanvas) {
        canvas._tmpCanvas = cloneCanvas(canvas);
        canvas.parentNode.insertBefore(canvas._tmpCanvas, canvas.nextSibling);
    }
    return canvas._tmpCanvas;
}

function removeTempCanvasFor(canvas) {
    const tmpCanvas = getTempCanvasFor(canvas);
    tmpCanvas && tmpCanvas.remove();
    canvas._tmpCanvas = null;
}

function onMouseMove(canvas, drawPoints, brushType, brushWidth, color = 'red') {
    const ctx = canvas.getContext('2d');
    ctx.globalCompositeOperation = 'source-over';

    const tempCanvas = getTempCanvasFor(canvas, true);
    if (brushType == BRUSH) {
        drawBrush(tempCanvas, drawPoints, color, brushWidth);
    } else if (brushType == ERASER) {
        ctx.globalCompositeOperation = 'destination-out';
        drawLine(tempCanvas, drawPoints, 'black', brushWidth);
    } else {
        drawLine(tempCanvas, drawPoints, color, brushWidth);
    }
}

function drawLine(canvas, drawPoints, color, brushWidth) {
    const ctx = canvas.getContext('2d');
    ctx.beginPath();

    let strokeStyle = color;
    const lastPosition = drawPoints[drawPoints.length - 1];
    ctx.moveTo(lastPosition.x, lastPosition.y);

    ctx.lineWidth = brushWidth;
    ctx.strokeStyle = strokeStyle;
    ctx.lineTo(drawPoints[0].x, drawPoints[0].y);
    ctx.stroke();
}

function drawBrush(canvas, drawPoints, color, brushWidth) {
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

function getMousePos(canvas, clientX, clientY) {
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

export default CanvasPaint;
