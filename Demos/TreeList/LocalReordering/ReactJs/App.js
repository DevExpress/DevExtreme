import React from 'react';
import TreeList, { Column, RowDragging } from 'devextreme-react/tree-list';
import CheckBox from 'devextreme-react/check-box';
import { employees as employeeList } from './data.js';

const expandedRowKeys = [1];
const onDragChange = (e) => {
  const visibleRows = e.component.getVisibleRows();
  const sourceNode = e.component.getNodeByKey(e.itemData.ID);
  let targetNode = visibleRows[e.toIndex].node;
  while (targetNode && targetNode.data) {
    if (targetNode.data.ID === sourceNode.data.ID) {
      e.cancel = true;
      break;
    }
    targetNode = targetNode.parent;
  }
};
const App = () => {
  const [employees, setEmployees] = React.useState(employeeList);
  const [allowDropInsideItem, setAllowDropInsideItem] = React.useState(true);
  const [allowReordering, setAllowReordering] = React.useState(true);
  const [showDragIcons, setShowDragIcons] = React.useState(true);
  const onReorder = React.useCallback(
    (e) => {
      const visibleRows = e.component.getVisibleRows();
      let sourceData = e.itemData;
      const updatedEmployees = [...employees];
      const sourceIndex = updatedEmployees.indexOf(sourceData);
      if (e.dropInsideItem) {
        sourceData = { ...sourceData, Head_ID: visibleRows[e.toIndex].key };
        updatedEmployees.splice(sourceIndex, 1);
        updatedEmployees.splice(e.toIndex, 0, sourceData);
      } else {
        const toIndex = e.fromIndex > e.toIndex ? e.toIndex - 1 : e.toIndex;
        let targetData = toIndex >= 0 ? visibleRows[toIndex].node.data : null;
        if (targetData && e.component.isRowExpanded(targetData.ID)) {
          sourceData = { ...sourceData, Head_ID: targetData.ID };
          targetData = null;
        } else {
          const headId = targetData ? targetData.Head_ID : -1;
          if (sourceData.Head_ID !== headId) {
            sourceData = { ...sourceData, Head_ID: headId };
          }
        }
        updatedEmployees.splice(sourceIndex, 1);
        const targetIndex = updatedEmployees.indexOf(targetData) + 1;
        updatedEmployees.splice(targetIndex, 0, sourceData);
      }
      setEmployees(updatedEmployees);
    },
    [employees],
  );
  return (
    <div>
      <TreeList
        id="employees"
        dataSource={employees}
        rootValue={-1}
        keyExpr="ID"
        showRowLines={true}
        showBorders={true}
        parentIdExpr="Head_ID"
        defaultExpandedRowKeys={expandedRowKeys}
        columnAutoWidth={true}
      >
        <RowDragging
          onDragChange={onDragChange}
          onReorder={onReorder}
          allowDropInsideItem={allowDropInsideItem}
          allowReordering={allowReordering}
          showDragIcons={showDragIcons}
        />
        <Column
          dataField="Title"
          caption="Position"
        />
        <Column dataField="Full_Name" />
        <Column dataField="City" />
        <Column dataField="State" />
        <Column dataField="Mobile_Phone" />
        <Column
          dataField="Hire_Date"
          dataType="date"
        />
      </TreeList>

      <div className="options">
        <div className="caption">Options</div>
        <div className="options-container">
          <div className="option">
            <CheckBox
              value={allowDropInsideItem}
              text="Allow Drop Inside Item"
              onValueChange={setAllowDropInsideItem}
            />
          </div>
          <div className="option">
            <CheckBox
              value={allowReordering}
              text="Allow Reordering"
              onValueChange={setAllowReordering}
            />
          </div>
          <div className="option">
            <CheckBox
              value={showDragIcons}
              text="Show Drag Icons"
              onValueChange={setShowDragIcons}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default App;
