import React, { useState, useEffect, useRef } from 'react';
import { CanvasPaint as styles } from './CanvasPaint.css';
import PropTypes from 'prop-types';
import { getMousePos, drawBrush, drawLine } from '../draw';
import { getTempCanvasFor, removeTempCanvasFor, clearCanvas } from '../canvas';

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

                    const newDrawPoints = [...drawPoints, currentPosition];
                    setDrawPoints(newDrawPoints);
                    onMouseMove(
                        e.target,
                        newDrawPoints,
                        brushType,
                        brushWidth,
                        color
                    );
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

function onMouseMove(canvas, drawPoints, brushType, brushWidth, color = 'red') {
    const ctx = canvas.getContext('2d');
    ctx.globalCompositeOperation = 'source-over';

    if (brushType == BRUSH) {
        const tempCanvas = getTempCanvasFor(canvas, true);
        drawBrush(tempCanvas, drawPoints, color, brushWidth);
    } else if (brushType == ERASER) {
        ctx.globalCompositeOperation = 'destination-out';
        drawLine(canvas, drawPoints, 'black', brushWidth);
    } else {
        drawLine(canvas, drawPoints, color, brushWidth);
    }
}

export default CanvasPaint;
