import React, { useCallback, useState } from 'react';
import DataGrid, { Scrolling, Sorting, LoadPanel } from 'devextreme-react/data-grid';
import { generateData } from './data.js';

const dataSource = generateData(100000);
const customizeColumns = (columns) => {
  columns[0].width = 70;
};
const App = () => {
  const [loadPanelEnabled, setLoadPanelEnabled] = useState(true);
  const onContentReady = useCallback(() => {
    setLoadPanelEnabled(false);
  }, []);
  return (
    <DataGrid
      height={440}
      dataSource={dataSource}
      keyExpr="id"
      showBorders={true}
      customizeColumns={customizeColumns}
      onContentReady={onContentReady}
    >
      <Sorting mode="none" />
      <Scrolling mode="virtual" />
      <LoadPanel enabled={loadPanelEnabled} />
    </DataGrid>
  );
};
export default App;
