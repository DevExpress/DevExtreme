import React, { useState } from 'react';
import NumberBoxExample from './examples/OnChangedTrimExample';
import GridExample from './examples/OnChangedTrimGridExample';

const App = () => {
    const [probe, setProbe] = useState<'value' | 'selection'>('value');
    return (
        <div>
            <div style={{ padding: 12, display: 'flex', gap: 8, fontFamily: 'monospace' }}>
                <button onClick={() => setProbe('value')} disabled={probe === 'value'}>NumberBox echo/cascade</button>
                <button onClick={() => setProbe('selection')} disabled={probe === 'selection'}>DataGrid selection loop</button>
            </div>
            {probe === 'value' ? <NumberBoxExample /> : <GridExample />}
        </div>
    );
};

export default App;
