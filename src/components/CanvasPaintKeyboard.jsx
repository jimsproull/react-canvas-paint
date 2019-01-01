import React, { useState, useEffect } from 'react';
import { MODES, BRUSHES } from '../constants';
// import KeyboardEventHandler from 'react-keyboard-event-handler';

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
        z: () => setMode(MODES.UNDO)
    };

    let keydownEvents = [];
    function onKeyDown(e) {
        console.log('down', e);
        keydownEvents.push(e);
    }

    function onKeyUp(e) {
        console.log('up', e);
        const lastKeyEvent = keydownEvents[keydownEvents.length - 1];
        const containsShift = lastKeyEvent.shiftKey;
        const containsMeta = lastKeyEvent.metaKey;

        if (lastKeyEvent) {
            const key = lastKeyEvent.keyCode;
            const number = Number(key) - 48; // number 0 starts at 48 ASCII
            if (number && containsShift) {
                setBrushWidth(number);
            } else if (colors[number]) {
                setColor(colors[number]);
            } else if (containsMeta && metaKeys[lastKeyEvent.key]) {
                metaKeys[lastKeyEvent.key]();
            } else if (keys[lastKeyEvent.key]) {
                keys[lastKeyEvent.key]();
            }
        }

        keydownEvents = [];
        setMode(MODES.DRAW);
    }

    useEffect(() => {
        // document.addEventListener('keydown', onKeyDown);
        // document.addEventListener('keyup', onKeyUp);
        // return () => {
        //     document.removeEventListener('keydown', onKeyDown);
        //     document.removeEventListener('keyup', onKeyUp);
        // };
    });

    const clonedChildren = React.cloneElement(children, {
        color,
        mode,
        brushType,
        brushWidth
    });

    return (
        <React.Fragment>
            <KeyboardEventHandler
                handleKeys={['a', 'b', 'c']}
                onKeyEvent={(key, e) =>
                    console.log(`do something upon keydown event of ${key}`)
                }
            />
            {clonedChildren}
            );
        </React.Fragment>
    );
};

export default CanvasPaintKeyboard;
