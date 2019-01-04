import React from 'react';
import ReactDOM from 'react-dom';
import CanvasPaintKeyboard from './src/components/CanvasPaintKeyboard.jsx';
import CanvasPaintUndoable from './src/components/CanvasPaintUndoable.jsx';

window.renderCanvasPaint = function(node) {
    ReactDOM.render(
        <CanvasPaintKeyboard>
            <CanvasPaintUndoable />
        </CanvasPaintKeyboard>,
        node
    );
};
