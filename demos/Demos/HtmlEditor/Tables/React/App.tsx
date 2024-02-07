import React, { useCallback, useState } from 'react';
import HtmlEditor, {
  TableContextMenu,
  TableResizing,
  Toolbar,
  Item,
} from 'devextreme-react/html-editor';
import { CheckBox, CheckBoxTypes } from 'devextreme-react/check-box';
import { markup } from './data.ts';

export default function App() {
  const [allowResizing, setAllowResizing] = useState(true);
  const [contextMenuEnabled, setContextMenuEnabled] = useState(true);

  const tableResizingChanged = useCallback((e: CheckBoxTypes.ValueChangedEvent) => {
    setAllowResizing(e.value);
  }, [setAllowResizing]);

  const tableContextMenuChanged = useCallback((e: CheckBoxTypes.ValueChangedEvent) => {
    setContextMenuEnabled(e.value);
  }, [setContextMenuEnabled]);

  return (
    <div className="widget-container">
      <HtmlEditor height="750px" defaultValue={markup}>
        <TableContextMenu enabled={contextMenuEnabled} />
        <TableResizing enabled={allowResizing} />
        <Toolbar>
          <Item name="bold" />
          <Item name="color" />
          <Item name="separator" />
          <Item name="alignLeft" />
          <Item name="alignCenter" />
          <Item name="alignRight" />
          <Item name="separator" />
          <Item name="insertTable" />
          <Item name="insertHeaderRow" />
          <Item name="insertRowAbove" />
          <Item name="insertRowBelow" />
          <Item name="separator" />
          <Item name="insertColumnLeft" />
          <Item name="insertColumnRight" />
          <Item name="separator" />
          <Item name="deleteColumn" />
          <Item name="deleteRow" />
          <Item name="deleteTable" />
          <Item name="separator" />
          <Item name="cellProperties" />
          <Item name="tableProperties" />
        </Toolbar>
      </HtmlEditor>
      <div className="options">
        <div className="caption">Options</div>
        <div className="option">
          <CheckBox
            text="Allow Table Resizing"
            value={allowResizing}
            onValueChanged={tableResizingChanged}
          />
        </div>
        <div className="option">
          <CheckBox
            text="Enable Table Context Menu"
            value={contextMenuEnabled}
            onValueChanged={tableContextMenuChanged}
          />
        </div>
      </div>
    </div>
  );
}
