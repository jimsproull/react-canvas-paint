import React, { useState, useEffect, useRef } from 'react';
import { CanvasPaint as styles } from './CanvasPaint.css';
import PropTypes from 'prop-types';
import { getMousePos, drawBrush, drawLine } from '../draw';
import { clearCanvas, drawImageData, getImageData } from '../canvas';
import { BRUSHES, MODES } from '../constants';

const CanvasPaint = ({
    brushType,
    brushWidth,
    color,
    width = '400px',
    height = '400px',
    mode
}) => {
    const [isDrawing, setIsDrawing] = useState(false);
    const [hasDrawn, setHasDrawn] = useState(false);
    const [lastMode, setLastMode] = useState(mode);
    const [drawPoints, setDrawPoints] = useState([]);
    const [undoStack, setUndoStack] = useState([]);
    const [undoIndex, setUndoIndex] = useState(-1);

    const canvasRef = useRef(null);
    useEffect(() => {
        if (mode != lastMode && canvasRef.current) {
            switch (mode) {
            case MODES.CLEAR: {
                clearCanvas(canvasRef.current);
                break;
            }
            case MODES.UNDO: {
                const undoData = undoStack[undoIndex - 1];
                if (undoData) {
                    drawImageData(canvasRef.current, undoData);
                    setUndoIndex(undoIndex - 1);
                }
                break;
            }
            case MODES.REDO: {
                const redoData = undoStack[undoIndex + 1];
                if (redoData) {
                    drawImageData(canvasRef.current, redoData);
                    setUndoIndex(undoIndex + 1);
                }
            }
            }
            setLastMode(mode);
        }
    });

    // todo make this a hook
    const addToUndoStack = newImageData => {
        const newStack = [...undoStack];
        newStack.length = undoIndex + 1; // truncate
        newStack.push(newImageData);
        setUndoStack(newStack);
        setUndoIndex(undoIndex + 1);
    };

    return (
        <canvas
            className={styles}
            ref={canvasRef}
            width={width}
            height={height}
            onMouseDown={e => {
                setIsDrawing(true);
                setDrawPoints([getMousePos(e.target, e.clientX, e.clientY)]);
                // todo - this only should be done once we start moving /shrug/
                e.target._originalPixelData = getImageData(e.target);
            }}
            onMouseMove={e => {
                if (isDrawing) {
                    if (!hasDrawn && !undoStack.length) {
                        addToUndoStack(e.target._originalPixelData);
                    }
                    setHasDrawn(true);
                    const currentPosition = getMousePos(
                        canvasRef.current,
                        e.clientX,
                        e.clientY
                    );

                    const newDrawPoints = [...drawPoints, currentPosition];
                    setDrawPoints(newDrawPoints);
                    doDraw(
                        e.target,
                        newDrawPoints,
                        brushType,
                        brushWidth,
                        color
                    );
                }
            }}
            onMouseUp={e => {
                if (hasDrawn) {
                    const newImageData = getImageData(e.target);
                    addToUndoStack(newImageData);
                    e.target._originalPixelData = null;
                }
                setIsDrawing(false);
                setHasDrawn(false);
                setDrawPoints([]);
            }}
        />
    );
};

CanvasPaint.propTypes = {
    undo: PropTypes.number,
    redo: PropTypes.number,
    clear: PropTypes.bool,
    brushType: PropTypes.oneOf(Object.values(BRUSHES)),
    color: PropTypes.string,
    width: PropTypes.string,
    height: PropTypes.string,
    mode: PropTypes.oneOf(Object.values(MODES)),
    brushWidth: PropTypes.number
};

CanvasPaint.defaultProps = {
    brushType: BRUSHES.BRUSH,
    brushWidth: 10,
    color: 'black',
    width: '400px',
    height: '400px'
};

function doDraw(canvas, drawPoints, brushType, brushWidth, color = 'red') {
    const ctx = canvas.getContext('2d');
    ctx.globalCompositeOperation = 'source-over';

    if (brushType == BRUSHES.BRUSH) {
        const originalPixelData = canvas._originalPixelData;
        drawBrush(canvas, originalPixelData, drawPoints, color, brushWidth);
    } else if (brushType == BRUSHES.ERASER) {
        ctx.globalCompositeOperation = 'destination-out';
        drawLine(canvas, drawPoints, 'black', brushWidth);
    } else {
        drawLine(canvas, drawPoints, color, brushWidth);
    }
}

export default CanvasPaint;
