import React from 'react';
import DataGrid from 'devextreme-react/data-grid';
import { customers } from './data';

const columns = ['CompanyName', 'City', 'State', 'Phone', 'Fax'];

const App = () => (
    <DataGrid
        dataSource={customers}
        defaultColumns={columns}
        showBorders={true}
    />
);

export default App;
