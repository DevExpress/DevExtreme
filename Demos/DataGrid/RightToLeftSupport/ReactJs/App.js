import React from 'react';
import DataGrid, { Column, Paging, SearchPanel } from 'devextreme-react/data-grid';
import SelectBox from 'devextreme-react/select-box';
import { europeanUnion } from './data.js';

const populationFormat = { type: 'fixedPoint', precision: 0 };
const areaFormat = { type: 'fixedPoint', precision: 0 };
const languageLabel = { 'aria-label': 'Language' };
const languages = ['Arabic (Right-to-Left direction)', 'English (Left-to-Right direction)'];
const App = () => {
  const [placeholder, setPlaceholder] = React.useState('Search...');
  const [rtlEnabled, setRtlEnabled] = React.useState(false);
  const [selectedValue, setSelectedValue] = React.useState(languages[1]);
  const onSelectLanguage = React.useCallback((e) => {
    const newRtlEnabled = e.value === languages[0];
    setRtlEnabled(newRtlEnabled);
    setPlaceholder(newRtlEnabled ? 'بحث' : 'Search...');
    setSelectedValue(e.value);
  }, []);
  const headerCellRender = React.useCallback(
    () => (
      <div>
        {rtlEnabled ? (
          <div>
            المساحة (كم<sup>2</sup>)
          </div>
        ) : (
          <div>
            Area (km<sup>2</sup>)
          </div>
        )}
      </div>
    ),
    [rtlEnabled],
  );
  return (
    <React.Fragment>
      <DataGrid
        id="gridContainer"
        dataSource={europeanUnion}
        keyExpr="nameEn"
        rtlEnabled={rtlEnabled}
        showBorders={true}
      >
        <Paging defaultPageSize={15} />
        <SearchPanel
          visible={true}
          placeholder={placeholder}
        />
        <Column
          dataField={rtlEnabled ? 'nameAr' : 'nameEn'}
          caption={rtlEnabled ? 'الدولة' : 'Name'}
        />
        <Column
          dataField={rtlEnabled ? 'capitalAr' : 'capitalEn'}
          caption={rtlEnabled ? 'عاصمة' : 'Capital'}
        />
        <Column
          dataField="population"
          caption={rtlEnabled ? 'عدد السكان (نسمة) 2013' : 'Population'}
          format={populationFormat}
        />
        <Column
          dataField="area"
          headerCellRender={headerCellRender}
          format={areaFormat}
        />
        <Column
          dataField="accession"
          visible={false}
        />
      </DataGrid>
      <div className="options">
        <div className="caption">Options</div>
        <div className="option">
          <span>Language: </span>
          <SelectBox
            id="select-language"
            items={languages}
            value={selectedValue}
            inputAttr={languageLabel}
            width={250}
            onValueChanged={onSelectLanguage}
          />
        </div>
      </div>
    </React.Fragment>
  );
};
export default App;
