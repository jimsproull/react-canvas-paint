import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { CanvasPaint as styles } from './CanvasPaint.css';
import PropTypes from 'prop-types';
import { getMousePos, drawBrush, drawLine } from '../draw';
import { clearCanvas, drawImageData, getImageData } from '../canvas';
import { BRUSHES, MODES } from '../constants';

const CanvasPaint = React.forwardRef(
    (
        {
            brushType,
            brushWidth,
            color,
            width = '400px',
            height = '400px',
            mode,
            onStartDraw,
            onEndDraw,
            pixelData
        },
        ref
    ) => {
        const [isDrawing, setIsDrawing] = useState(false);
        const [hasDrawn, setHasDrawn] = useState(false);
        const [lastMode, setLastMode] = useState(mode);
        const [drawPoints, setDrawPoints] = useState([]);

        const canvasRef = ref || useRef(null);
        useEffect(
            () => {
                if (mode != lastMode && canvasRef.current) {
                    switch (mode) {
                        case MODES.CLEAR: {
                            clearCanvas(canvasRef.current);
                            break;
                        }
                    }
                    setLastMode(mode);
                }
            },
            [mode]
        );

        useLayoutEffect(
            () => {
                if (pixelData) {
                    drawImageData(canvasRef.current, pixelData);
                }
            },
            [pixelData]
        );

        return (
            <canvas
                className={styles}
                ref={canvasRef}
                width={width}
                height={height}
                onMouseDown={e => {
                    setIsDrawing(true);
                    setDrawPoints([
                        getMousePos(e.target, e.clientX, e.clientY)
                    ]);
                    // todo - this only should be done once we start moving /shrug/
                    e.target._originalPixelData = getImageData(e.target);
                }}
                onMouseMove={e => {
                    if (isDrawing) {
                        if (!hasDrawn) {
                            onStartDraw(e.target._originalPixelData);
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
                        onEndDraw(newImageData);
                        e.target._originalPixelData = null;
                    }
                    setIsDrawing(false);
                    setHasDrawn(false);
                    setDrawPoints([]);
                }}
            />
        );
    }
);

CanvasPaint.propTypes = {
    clear: PropTypes.bool,
    brushType: PropTypes.oneOf(Object.values(BRUSHES)),
    color: PropTypes.string,
    width: PropTypes.string,
    height: PropTypes.string,
    mode: PropTypes.oneOf(Object.values(MODES)),
    brushWidth: PropTypes.number,
    onStartDraw: PropTypes.func,
    onEndDraw: PropTypes.func
};

CanvasPaint.defaultProps = {
    brushType: BRUSHES.BRUSH,
    brushWidth: 10,
    color: 'purple',
    width: '400px',
    height: '400px',
    onStartDraw: () => {},
    onEndDraw: () => {}
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
