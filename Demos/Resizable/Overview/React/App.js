import React from 'react';
import DataGrid, { Paging, Scrolling, Column } from 'devextreme-react/data-grid';
import Resizable from 'devextreme-react/resizable';
import CheckBox from 'devextreme-react/check-box';
import TagBox from 'devextreme-react/tag-box';

import { orders, handleLabel } from './data.js';

const handleValues = ['left', 'top', 'right', 'bottom'];

function App() {
  const [keepAspectRatio, setKeepAspectRatio] = React.useState(true);
  const [handles, setHandles] = React.useState(handleValues);
  const [resizableClasses, setResizableClasses] = React.useState('');

  const keepAspectRatioValueChange = React.useCallback((value) => {
    setKeepAspectRatio(value);
  }, [setKeepAspectRatio]);

  const handlesValueChange = React.useCallback((value) => {
    const classes = handleValues.reduce((acc, handle) => {
      const newClass = value.includes(handle) ? '' : ` no-${handle}-handle`;
      return acc + newClass;
    }, '');

    setHandles(value);
    setResizableClasses(classes);
  }, [setHandles]);

  return <React.Fragment>
    <div className='widget-container'>
      <div className='dx-fieldset'>
        <div className='dx-fieldset-header'>Resizable DataGrid</div>
        <div className='dx-field'>
          <Resizable
            className={resizableClasses}
            id='gridContainer'
            minWidth={400}
            minHeight={150}
            maxHeight={370}
            keepAspectRatio={keepAspectRatio}
            handles={handles.join(' ')}
            area='.widget-container .dx-field'
          >
            <DataGrid
              id='grid'
              dataSource={orders}
              keyExpr='ID'
              showBorders={true}
              height='100%'
            >
              <Paging pageSize={8} />
              <Scrolling mode='virtual' />
              <Column allowGrouping={false} dataField='OrderNumber' width={130} caption='Invoice Number' />
              <Column dataField='CustomerStoreCity' caption='City' />
              <Column dataField='CustomerStoreState' caption='State' />
              <Column dataField='Employee' />
              <Column dataField='OrderDate' dataType='date' />
              <Column dataField='SaleAmount' format='currency' />
            </DataGrid>
          </Resizable>
        </div>
      </div>
    </div>
    <div className='options'>
      <div className='caption'>Resizable Options</div>
      <div className='option'>
        <div>Handles</div>
        <TagBox
          items={handleValues}
          value={handles}
          inputAttr={handleLabel}
          onValueChange={handlesValueChange}
        />
      </div>
      <div className='option'>
        <CheckBox
          text='Keep aspect ratio'
          value={true}
          onValueChange={keepAspectRatioValueChange}
        />
      </div>
    </div>
  </React.Fragment>;
}

export default App;
