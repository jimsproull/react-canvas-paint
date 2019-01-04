import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import CanvasPaint from './CanvasPaint';
import { MODES } from '../constants';
import { getImageData } from '../canvas';

const CanvasPaintUndoable = ({ mode, ...props }) => {
    const [undoStack, setUndoStack] = useState([]);
    const [undoIndex, setUndoIndex] = useState(-1);
    const [lastMode, setLastMode] = useState(mode);
    const [pixelData, setPixelData] = useState();
    const canvasRef = useRef();

    // todo make this a hook?
    const addToUndoStack = newImageData => {
        const newStack = [...undoStack];
        newStack.length = undoIndex + 1; // truncate
        newStack.push(newImageData);
        setUndoStack(newStack);
        setUndoIndex(undoIndex + 1);
    };

    useEffect(
        () => {
            if (mode != lastMode && canvasRef.current) {
                switch (mode) {
                    case MODES.CLEAR: {
                        addToUndoStack(getImageData(canvasRef.current));
                        break;
                    }
                    case MODES.UNDO: {
                        const newUndoIndex = undoIndex - 1;
                        if (newUndoIndex >= 0) {
                            setPixelData(undoStack[newUndoIndex]);
                            setUndoIndex(newUndoIndex);
                        }
                        break;
                    }
                    case MODES.REDO: {
                        const newUndoIndex = undoIndex + 1;
                        if (newUndoIndex < undoStack.length) {
                            setPixelData(undoStack[newUndoIndex]);
                            setUndoIndex(newUndoIndex);
                        }
                        break;
                    }
                    default: {
                        setPixelData(undefined);
                    }
                }
                setLastMode(mode);
            }
        },
        [mode]
    );

    useLayoutEffect(
        () => {
            mode != lastMode && onModeSwitch(mode, lastMode);
        },
        [mode]
    );

    function onStartDraw(pixelData) {
        undoStack.length == 0 && addToUndoStack(pixelData);
        props.onStartDraw && props.onStartDraw(pixelData);
    }

    function onEndDraw(pixelData) {
        addToUndoStack(pixelData);
        props.onEndDraw && props.onEndDraw(pixelData);
    }

    function onModeSwitch(mode, previousMode) {
        props.onModeSwitch && props.onModeSwitch(mode, previousMode);
        if (mode == MODES.UNDO || mode == MODES.REDO) {
            setPixelData(undefined);
        }
    }

    return (
        <CanvasPaint
            {...props}
            onStartDraw={onStartDraw}
            onEndDraw={onEndDraw}
            ref={canvasRef}
            mode={mode}
            pixelData={pixelData}
        />
    );
};

CanvasPaintUndoable.propTypes = CanvasPaint.propTypes;

CanvasPaintUndoable.defaultProps = CanvasPaint.defaultProps;

export default CanvasPaintUndoable;
