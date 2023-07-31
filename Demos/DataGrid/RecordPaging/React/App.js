import React from 'react';
import DataGrid, { Scrolling, Pager, Paging } from 'devextreme-react/data-grid';
import SelectBox from 'devextreme-react/select-box';
import CheckBox from 'devextreme-react/check-box';
import { generateData, displayModeLabel } from './data.js';

const displayModes = [{ text: 'Display Mode \'full\'', value: 'full' }, { text: 'Display Mode \'compact\'', value: 'compact' }];
const allowedPageSizes = [5, 10, 'all'];
const data = generateData(100000);

const customizeColumns = (columns) => { columns[0].width = 70; };

const App = () => {
  const [displayMode, setDisplayMode] = React.useState('full');
  const [showPageSizeSelector, setShowPageSizeSelector] = React.useState(true);
  const [showInfo, setShowInfo] = React.useState(true);
  const [showNavButtons, setShowNavButtons] = React.useState(true);

  const displayModeChange = React.useCallback((value) => {
    setDisplayMode(value);
  }, []);

  const showPageSizeSelectorChange = React.useCallback((value) => {
    setShowPageSizeSelector(value);
  }, []);

  const showInfoChange = React.useCallback((value) => {
    setShowInfo(value);
  }, []);

  const showNavButtonsChange = React.useCallback((value) => {
    setShowNavButtons(value);
  }, []);

  const isCompactMode = React.useCallback(() => displayMode === 'compact', [displayMode]);

  return (
    <div>
      <DataGrid
        id='gridContainer'
        dataSource={data}
        keyExpr="id"
        showBorders={true}
        customizeColumns={customizeColumns}
      >
        <Scrolling rowRenderingMode='virtual'></Scrolling>
        <Paging defaultPageSize={10} />
        <Pager
          visible={true}
          allowedPageSizes={allowedPageSizes}
          displayMode={displayMode}
          showPageSizeSelector={showPageSizeSelector}
          showInfo={showInfo}
          showNavigationButtons={showNavButtons} />
      </DataGrid>
      <div className='options'>
        <div className='caption'>Options</div>
        <div className='option-container'>
          <div className='option'>
            <SelectBox
              id='displayModes'
              items={displayModes}
              displayExpr='text'
              inputAttr={displayModeLabel}
              valueExpr='value'
              value={displayMode}
              onValueChange={displayModeChange} />
          </div>
          <div className='option'>
            <CheckBox
              id='showPageSizes'
              text='Show Page Size Selector'
              value={showPageSizeSelector}
              onValueChange={showPageSizeSelectorChange} />
          </div>
          <div className='option'>
            <CheckBox
              id='showInfo'
              text='Show Info Text'
              value={showInfo}
              onValueChange={showInfoChange} />
          </div>
          <div className='option'>
            <CheckBox
              id='showNavButtons'
              text='Show Navigation Buttons'
              value={showNavButtons}
              onValueChange={showNavButtonsChange}
              disabled={isCompactMode()} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
