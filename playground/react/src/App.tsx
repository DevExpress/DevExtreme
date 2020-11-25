import React from 'react';
import Tooltip from './artifacts/react/renovation/viz/core/tooltip';

function App() {
    const [MousePosition, setMousePosition] = React.useState({
        left: 0,
        top: 0
    })
    function handleMouseMove(ev) { setMousePosition({left: ev.pageX, top: ev.pageY}); }
    return (
        <svg width="500" height="600">
            <rect width="500" height="500" fill='white' onPointerMove={(ev)=> handleMouseMove(ev)} strokeWidth={1} stroke='black'></rect>
            <Tooltip 
                text={'Tooltip Text'} x={MousePosition.left} y={MousePosition.top} 
                canvas={{left: 0, top: 0, width: 500, height: 500, right: 0, bottom: 0}}
                offset={8}>
            </Tooltip>
        </svg>
    );
}

export default App;
