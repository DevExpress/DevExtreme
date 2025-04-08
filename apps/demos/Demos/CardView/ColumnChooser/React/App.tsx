import React, {useState, useRef, useCallback} from 'react';
import { CardView, CardCover, Column, Pager } from 'devextreme-react/card-view';
import { SelectBox, type SelectBoxTypes } from 'devextreme-react/select-box';
import { CheckBox } from 'devextreme-react/check-box';
// import ColumnChooser from 'devextreme-react/card-view';
import 'devextreme/dist/css/dx.fluent.blue.light.css';
import './style.css';
import { employees, columns, cardCover } from './data';

const columnChooserModes = [
  { key: "dragAndDrop", name: "Drag and drop" },
  { key: "select", name: "Select" },
];

const App = () => {
  const cardViewRef = useRef(null);
  const [mode, setMode] = useState(columnChooserModes[1].key);
  const [searchEnabled, setSearchEnabled] = useState(true);
  const [allowSelectAll, setAllowSelectAll] = useState(true);
  const [selectByClick, setSelectByClick] = useState(true);
  const [recursive, setRecursive] = useState(true);

  const onModeValueChanged = useCallback((e: SelectBoxTypes.ValueChangedEvent) => {
    setMode(e.value);
      requestAnimationFrame(() => {
        if (cardViewRef.current) {
          cardViewRef.current.instance().repaint();
        }
      });
  }, []);
  
  return (
    <div>
      <CardView
        ref={cardViewRef}
        dataSource={employees}
        keyExpr="ID"
        cardsPerRow={3}
        columns={columns}
        // Todo: use ColumnChooser nested component
        columnChooser={{
          enabled: true,
          mode: mode,
          position: {
            at: "center center",
          },
          width: 300,
          height: 500,
          search: {
            enabled: searchEnabled,
          },
          selection: {
            allowSelectAll: allowSelectAll,
            recursive: recursive,
            selectByClick: selectByClick,
          },
        }}
      >
        <CardCover
          imageExpr={cardCover.imageExpr}
          altExpr={cardCover.altExpr}
        />

        <Pager
            visible={true}
            showPageSizeSelector={true}
            allowedPageSizes={'auto'}
        >
        </Pager>

        {/* <ColumnChooser
            enabled={true}
            mode={'select'}
            position={{at: "center center"}}
            width={300}
            height={400}
            search={{enabled: true}}
            selection={
              {allowSelectAll: true,
              recursive: true,}
            }
        >
        </ColumnChooser> */}

      </CardView>

      <div className='options'>
        <div className="caption">
          Column Chooser Options
        </div>
        <div className="option">
          <span>Select Mode:</span>
          <SelectBox
            items={columnChooserModes}
            value={mode}
            valueExpr="key"
            displayExpr="name"
            inputAttr={{ "aria-label": "Column Chooser Mode" }}
            onValueChanged={onModeValueChanged}
          >
          </SelectBox>
        </div>
        <div className="checkboxes-container">
          <div className="option">
            <CheckBox
              text='Search Enabled'
              defaultValue={searchEnabled}
              onValueChanged={(e) => setSearchEnabled(e.value)}>
            </CheckBox>
          </div>
          <div className="option">
            <CheckBox
              text="Allow Select All"
              defaultValue={allowSelectAll}
              onValueChanged={(e) => setAllowSelectAll(e.value)}>
            </CheckBox>
          </div>
          <div className="option">
            <CheckBox
              text="Select By Click"
              defaultValue={selectByClick}
              onValueChanged={(e) => setSelectByClick(e.value)}>
            </CheckBox>
          </div>
          <div className="option">
            <CheckBox
              text="Recursive"
              defaultValue={recursive}
              onValueChanged={(e) => setRecursive(e.value)}>
            </CheckBox>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
