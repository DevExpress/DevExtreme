import React, { useCallback, useState } from 'react';
import Diagram, {
  Nodes, AutoLayout, Toolbox, PropertiesPanel,
} from 'devextreme-react/diagram';
import ArrayStore from 'devextreme/data/array_store';
import service from './data.js';

const dataSource = new ArrayStore({
  key: 'ID',
  data: service.getEmployees(),
});
const textExpression = 'Full_Name';
function onContentReady(e) {
  const diagram = e.component;
  // preselect some shape
  const items = diagram
    .getItems()
    .filter((item) => item.itemType === 'shape' && item.dataItem[textExpression] === 'Greta Sims');
  if (items.length > 0) {
    diagram.setSelectedItems(items);
    diagram.scrollToItem(items[0]);
    diagram.focus();
  }
}
export default function App() {
  const [selectedItemNames, setSelectedItemNames] = useState('Nobody has been selected');
  const onSelectionChanged = useCallback(
    ({ items }) => {
      let selectedItems = 'Nobody has been selected';
      const filteredItems = items
        .filter((item) => item.itemType === 'shape')
        .map((item) => item.text);
      if (filteredItems.length > 0) {
        selectedItems = filteredItems.join(', ');
      }
      setSelectedItemNames(selectedItems);
    },
    [setSelectedItemNames],
  );
  return (
    <div>
      <Diagram
        id="diagram"
        onContentReady={onContentReady}
        onSelectionChanged={onSelectionChanged}
      >
        <Nodes
          dataSource={dataSource}
          keyExpr="ID"
          textExpr={textExpression}
          parentKeyExpr="Head_ID"
        >
          <AutoLayout type="tree" />
        </Nodes>
        <Toolbox visibility="disabled" />
        <PropertiesPanel visibility="disabled" />
      </Diagram>
      <div className="selected-data">
        <span className="caption">Selected Items:</span> <span>{selectedItemNames}</span>
      </div>
    </div>
  );
}
