import React, { useCallback, useState, useMemo } from 'react';
import HtmlEditor, { Toolbar, Item } from 'devextreme-react/html-editor';
import Popup from 'devextreme-react/popup';
import { markup } from './data.js';

const headerValues = [false, 1, 2, 3, 4, 5];
const headerOptions = { inputAttr: { 'aria-label': 'Header' } };
export default function App() {
  const [value, setValue] = useState(markup);
  const [popupVisible, setPopupVisible] = useState(false);
  const customButtonClick = useCallback(() => {
    setPopupVisible(true);
  }, [setPopupVisible]);
  const getToolbarButtonOptions = useMemo(
    () => ({
      text: 'Show markup',
      stylingMode: 'text',
      onClick: customButtonClick,
    }),
    [customButtonClick]
  );
  const valueChanged = useCallback(
    (e) => {
      setValue(e.value);
    },
    [setValue],
  );
  const popupHiding = useCallback(() => {
    setPopupVisible(false);
  }, [setPopupVisible]);
  return (
    <div className="widget-container">
      <HtmlEditor
        value={value}
        onValueChanged={valueChanged}
      >
        <Toolbar>
          <Item name="undo" />
          <Item name="redo" />
          <Item name="separator" />
          <Item
            name="header"
            acceptedValues={headerValues}
            options={headerOptions}
          />
          <Item name="separator" />
          <Item name="bold" />
          <Item name="italic" />
          <Item name="strike" />
          <Item name="underline" />
          <Item name="separator" />
          <Item name="alignLeft" />
          <Item name="alignCenter" />
          <Item name="alignRight" />
          <Item name="alignJustify" />
          <Item name="separator" />
          <Item
            widget="dxButton"
            options={getToolbarButtonOptions}
          />
        </Toolbar>
      </HtmlEditor>
      <Popup
        showTitle={true}
        title="Markup"
        visible={popupVisible}
        onHiding={popupHiding}
        showCloseButton={true}
      >
        {value}
      </Popup>
    </div>
  );
}
