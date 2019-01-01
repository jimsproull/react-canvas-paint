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

    const metaKeys = {
        z: (metaKey, shiftKey) =>
            metaKey && shiftKey ? setMode(MODES.REDO) : setMode(MODES.UNDO)
    };

    let keyEvent;
    function onKeyDown(e) {
        if (
            (e.metaKey && e.key === 'Meta') ||
            (e.shiftKey && e.key === 'Shift')
        ) {
            return;
        }
        keyEvent = e;
        handleKeyEvent();
    }

    function handleKeyEvent() {
        if (keyEvent) {
            const containsShift = keyEvent.shiftKey;
            const containsMeta = keyEvent.metaKey;

            const key = keyEvent.keyCode;
            const number = Number(key) - 48; // number 0 starts at 48 ASCII
            if ((containsMeta || containsShift) && metaKeys[keyEvent.key]) {
                metaKeys[keyEvent.key](containsMeta, containsShift);
            } else if (number && containsShift) {
                setBrushWidth(number);
            } else if (colors[number]) {
                setColor(colors[number]);
            } else if (keys[keyEvent.key]) {
                keys[keyEvent.key]();
            }

            setMode(MODES.DRAW);
        }
        keyEvent = null;
    }

    useEffect(() => {
        document.addEventListener('keydown', onKeyDown);
        return () => {
            document.removeEventListener('keydown', onKeyDown);
        };
    });

    return React.cloneElement(children, { color, mode, brushType, brushWidth });
};

export default CanvasPaintKeyboard;
