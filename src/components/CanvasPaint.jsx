import React, { useState, useEffect, useRef } from 'react';
import { CanvasPaint as styles } from './CanvasPaint.css';
import PropTypes from 'prop-types';

const PENCIL = 'pencil';
const PAINT = 'paint';
const ERASER = 'eraser';

const CLEAR = 'clear';
const DRAW = 'draw';
export const MODES = {
    CLEAR,
    DRAW
};
export const BRUSHES = {
    PENCIL,
    PAINT,
    ERASER
};

const CanvasPaint = ({
    brushType,
    color,
    width = '400px',
    height = '400px',
    mode
}) => {
    const [isDrawing, setIsDrawing] = useState(false);
    const [lastPosition, setLastPosition] = useState(undefined);
    const [lastMode, setLastMode] = useState(mode);
    const canvas = useRef(null);
    useEffect(() => {
        if (mode != lastMode && canvas.current) {
            if (mode == CLEAR) {
                clearCanvas(canvas.current);
            }
            setLastMode(mode);
        }
    });
    return (
        <canvas
            className={styles}
            ref={canvas}
            width={width}
            height={height}
            onMouseDown={e => {
                setIsDrawing(true);
                onMouseDown(e);
            }}
            onMouseMove={e =>
                isDrawing &&
                setLastPosition(onMouseMove(e, brushType, color, lastPosition))
            }
            onMouseUp={e => {
                setIsDrawing(false);
                setLastPosition(undefined);
                onMouseUp(e);
            }}
        />
    );
};

CanvasPaint.propTypes = {
    clear: PropTypes.bool,
    brushType: PropTypes.oneOf([PENCIL, ERASER, PAINT]),
    color: PropTypes.string,
    width: PropTypes.string,
    height: PropTypes.string,
    mode: PropTypes.oneOf([CLEAR, DRAW])
};

function clearCanvas(canvas) {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function onMouseDown() {}

function onMouseUp() {}

function onMouseMove(e, brushType, color = 'red', lastPosition) {
    const canvas = e.target;
    const pos = getMousePos(canvas, e.clientX, e.clientY);
    const ctx = canvas.getContext('2d');
    ctx.lineWidth = 4;
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.moveTo(
        (lastPosition && lastPosition.x) || pos.x,
        (lastPosition && lastPosition.y) || pos.y
    );
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    return pos;
}

function getMousePos(canvas, clientX, clientY) {
    var rect = canvas.getBoundingClientRect();

    return {
        x: (clientX - rect.left) * (canvas.width / rect.width),
        y: (clientY - rect.top) * (canvas.height / rect.height)
    };
}

export default CanvasPaint;
