import React, { useCallback, useState } from 'react';
import DataGrid, {
  Column, RowDragging, Scrolling, Lookup, Sorting,
} from 'devextreme-react/data-grid';
import { CheckBox, CheckBoxTypes } from 'devextreme-react/check-box';
import { tasks as defaultTasks, employees } from './data.ts';

const App = () => {
  const [tasks, setTasks] = useState(defaultTasks);
  const [showDragIcons, setShowDragIcons] = useState(true);

  const onReorder = useCallback((e) => {
    const visibleRows = e.component.getVisibleRows();
    const newTasks = [...tasks];

    const toIndex = newTasks.findIndex((item) => item.ID === visibleRows[e.toIndex].data.ID);
    const fromIndex = newTasks.findIndex((item) => item.ID === e.itemData.ID);

    newTasks.splice(fromIndex, 1);
    newTasks.splice(toIndex, 0, e.itemData);

    setTasks(newTasks);
  }, [tasks]);

  const onShowDragIconsChanged = useCallback((args: CheckBoxTypes.ValueChangedEvent) => {
    setShowDragIcons(args.value);
  }, []);

  return (
    <React.Fragment>
      <DataGrid
        height={440}
        dataSource={tasks}
        keyExpr="ID"
        showBorders={true}
      >
        <RowDragging
          allowReordering={true}
          onReorder={onReorder}
          showDragIcons={showDragIcons}
        />
        <Scrolling mode="virtual" />
        <Sorting mode="none" />
        <Column dataField="ID" width={55} />
        <Column dataField="Owner" width={150}>
          <Lookup
            dataSource={employees}
            valueExpr="ID"
            displayExpr="FullName"
          />
        </Column>
        <Column
          dataField="AssignedEmployee"
          caption="Assignee"
          width={150}>
          <Lookup
            dataSource={employees}
            valueExpr="ID"
            displayExpr="FullName"
          />
        </Column>
        <Column dataField="Subject" />
      </DataGrid>

      <div className="options">
        <div className="caption">Options</div>
        <div className="option">
          <CheckBox
            value={showDragIcons}
            text="Show Drag Icons"
            onValueChanged={onShowDragIconsChanged}
          />
        </div>
      </div>
    </React.Fragment>
  );
};

export default App;
