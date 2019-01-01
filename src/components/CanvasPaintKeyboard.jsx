import React, { useState, useEffect } from 'react';
import { MODES, BRUSHES } from '../constants';

export const PENCIL = 'pencil';
export const BRUSH = 'brush';
export const ERASER = 'eraser';

const colors = ['black', 'red', 'blue', 'green', 'yellow', 'orange', 'purple'];

const CanvasPaintKeyboard = ({ children }) => {
    const [color, setColor] = useState('black');
    const [brushWidth, setBrushWidth] = useState(7);
    const [mode, setMode] = useState(undefined);
    const [brushType, setBrushType] = useState(undefined);
    const keys = {
        c: () => setMode(MODES.CLEAR),
        e: () => setBrushType(BRUSHES.ERASER),
        b: () => setBrushType(BRUSHES.BRUSH),
        p: () => setBrushType(BRUSHES.PENCIL)
    };

    let keydownEvents = [];
    function onKeyDown(e) {
        keydownEvents.push(e);
    }

    function onKeyUp() {
        const containsShift = !!keydownEvents.filter(e => e.shiftKey).length;
        const lastKeyEvent = keydownEvents[keydownEvents.length - 1];
        if (lastKeyEvent) {
            const key = lastKeyEvent.keyCode;
            const number = Number(key) - 48; // number 0 starts at 48 ASCII
            if (number && containsShift) {
                setBrushWidth(number);
            } else if (colors[number]) {
                setColor(colors[number]);
            } else if (keys[lastKeyEvent.key]) {
                keys[lastKeyEvent.key]();
            }
        }

        keydownEvents = [];
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

    return React.cloneElement(children, { color, mode, brushType, brushWidth });
};

export default CanvasPaintKeyboard;
