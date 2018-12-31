import React from 'react';
import ReactDOM from 'react-dom';
import CanvasPaint from './src/components/CanvasPaint.jsx';
import CanvasPaintKeyboard from './src/components/CanvasPaintKeyboard.jsx';

window.renderCanvasPaint = function(node) {
    ReactDOM.render(
        <CanvasPaintKeyboard>
            <CanvasPaint />
        </CanvasPaintKeyboard>,
        node
    );
};
