import React, { useState, useEffect } from 'react';
import { MODES, BRUSHES } from '../constants';

export const PENCIL = 'pencil';
export const BRUSH = 'brush';
export const ERASER = 'eraser';

const colors = ['black', 'red', 'blue', 'green', 'yellow', 'orange', 'purple'];

const initialState = {
    color: undefined,
    brushWidth: undefined,
    mode: MODES.DRAW,
    brushType: undefined
};
const CanvasPaintKeyboard = ({ children }) => {
    const [canvasState, setCanvasState] = useState(initialState);

    useEffect(() => {
        document.addEventListener('keydown', onKeyDown);
        return () => {
            document.removeEventListener('keydown', onKeyDown);
        };
    }, []);

    const keys = {
        c: state => ({ ...state, mode: MODES.CLEAR }),
        e: state => ({ ...state, brushType: BRUSHES.ERASER }),
        b: state => ({ ...state, brushType: BRUSHES.BRUSH }),
        p: state => ({ ...state, brushType: BRUSHES.PENCIL })
    };

    const metaKeys = {
        z: (state, metaKey, shiftKey) => {
            if (metaKey && shiftKey) {
                return { ...state, mode: MODES.REDO };
            } else {
                return { ...state, mode: MODES.UNDO };
            }
        }
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
            let newState = { ...initialState };
            if ((containsMeta || containsShift) && metaKeys[keyEvent.key]) {
                newState = metaKeys[keyEvent.key](
                    newState,
                    containsMeta,
                    containsShift
                );
            } else if (number && containsShift) {
                newState.brushWidth = number;
            } else if (colors[number]) {
                newState.color = colors[number];
            } else if (keys[keyEvent.key]) {
                newState = keys[keyEvent.key](newState);
            }

            setCanvasState(newState);
        }
        keyEvent = null;
    }

    function onModeSwitch(mode, previousMode) {
        if (
            mode != previousMode &&
            (mode == MODES.UNDO || mode == MODES.REDO)
        ) {
            setCanvasState({ ...canvasState, mode: previousMode });
        }
    }

    return React.cloneElement(children, { ...canvasState, onModeSwitch });
};

export default CanvasPaintKeyboard;
