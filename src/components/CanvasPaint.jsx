import React, { useState, useEffect, memo, forwardRef } from 'react';
import { CanvasPaint as styles } from './CanvasPaint.css';
import PropTypes from 'prop-types';

const ref = React.createRef();
const CanvasPaint = ({ clear }) => {
    useEffect(() => {
        // Update the document title using the browser API
        // document.title = `You clicked ${count} times`;
    });
    return (
        <CanvasComponent
            ref={ref}
            onMouseDown={onMouseDown}
            onMouseUp={onMouseUp}
            onMouseMove={onMouseMove}
            className={styles}
        />
    );
};

CanvasPaint.propTypes = {
    clear: PropTypes.bool
};

CanvasPaint.defaultProps = {
    clear: false
};

const CanvasComponent = forwardRef(
    ({ onMouseDown, className, onMouseMove, onMouseUp }, ref) => {
        const [isDrawing, setIsDrawing] = useState(false);
        const [lastPosition, setLastPosition] = useState(undefined);
        return (
            <canvas
                ref={ref}
                width="400px"
                height="400px"
                onMouseDown={e => {
                    setIsDrawing(true);
                    onMouseDown(e);
                }}
                className={className}
                onMouseMove={e =>
                    isDrawing && setLastPosition(onMouseMove(e, lastPosition))
                }
                onMouseUp={e => {
                    setIsDrawing(false);
                    setLastPosition(undefined);
                    onMouseUp(e);
                }}
            />
        );
    }
);

function onMouseDown() {}

function onMouseUp() {}

function onMouseMove(e, lastPosition) {
    const canvas = e.target;
    const pos = getMousePos(canvas, e.clientX, e.clientY);
    const ctx = canvas.getContext('2d');
    ctx.lineWidth = 4;
    ctx.strokeStyle = 'green';
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
