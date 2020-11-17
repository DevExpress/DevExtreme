import React from 'react';
import Tooltip from './artifacts/react/renovation/viz/core/tooltip';

function App() {
    return (
        <svg width="500" height="600">
        <Tooltip
            text={'Tooltip Text'}
            color="#fff"
            border={{
                color: "#000",
                width: 2
            }}
        ></Tooltip>
        </svg>
    );
}

export default App;
