import React, { useState, useEffect } from 'react';
import { MODES, BRUSHES } from './CanvasPaint';

export const PENCIL = 'pencil';
export const BRUSH = 'brush';
export const ERASER = 'eraser';

const colors = ['black', 'red', 'blue', 'green', 'yellow', 'orange', 'purple'];

const CanvasPaintKeyboard = ({ children }) => {
    const [color, setColor] = useState('black');
    const [mode, setMode] = useState(undefined);
    const [brushType, setBrushType] = useState(undefined);
    const keys = {
        c: () => setMode(MODES.CLEAR),
        e: () => setBrushType(BRUSHES.ERASER)
    };
    function onKeyDown(e) {
        const number = Number(e.key);
        if (colors[number]) {
            setColor(colors[number]);
        } else if (keys[e.key]) {
            keys[e.key]();
        }
    }

    function onKeyUp() {
        setMode(MODES.DRAW);
    }

    useEffect(() => {
        document.addEventListener('keydown', onKeyDown);
        document.addEventListener('keyup', onKeyUp);
        return () => {
            document.removeEventListener('keydown', onKeyDown);
            document.removeEventListener('keyup', onKeyUp);
        };
    });

    return React.cloneElement(children, { color, mode, brushType });
};

export default CanvasPaintKeyboard;
