import { CardView } from 'devextreme-react/card-view';
import React from 'react';

const data = [
    {
        id: 1,
        name: 'asd',
    },
    {
        id: 2,
        name: 'asd',
    },
    {
        id: 3,
        name: 'asd',
    },
    {
        id: 4,
        name: 'asd',
    },
]

const App = () => (
    <CardView
        keyExpr='id'
        dataSource={data}
    >
        
    </CardView>
);

export default App;
