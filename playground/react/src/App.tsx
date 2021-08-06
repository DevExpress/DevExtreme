import React from 'react';
import Button from './artifacts/react/renovation/ui/button';

function App() {
    return (
        <Button
            text={'Click Me!'}
            icon={'download'}
            onClick={() => alert('Clicked!')}
        ></Button>
    );
}

export default App;
