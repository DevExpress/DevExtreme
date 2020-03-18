import React from 'react';
import Button from 'devextreme/renovation/button';

const App = () => {
    return <Button
        text="Click Me!"
        onClick={() => alert('Clicked')}
        icon="download"
        iconPosition="right"
    />;
};

export default App;
