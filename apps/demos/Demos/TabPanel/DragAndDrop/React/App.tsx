import React, { useCallback, useState } from 'react';
import Button from 'devextreme-react/button';
import Sortable, { type SortableTypes } from 'devextreme-react/sortable';
import TabPanel, { type TabPanelTypes } from 'devextreme-react/tab-panel';

import { employees as allEmployees } from './data.ts';
import type { Employee } from './types.ts';
import EmployeeTemplate from './EmployeeTemplate.tsx';

function App() {
  const [employees, setEmployees] = useState<Employee[]>(allEmployees.slice(0, 3));
  const [selectedItem, setSelectedItem] = useState<Employee>(allEmployees[0]);

  const addButtonHandler = useCallback(() => {
    const newItem = allEmployees
      .filter((employee: Employee): boolean => employees.indexOf(employee) === -1)[0];

    setEmployees([...employees, newItem]);
    setSelectedItem(newItem);
  }, [employees]);

  function disableButton(): boolean {
    return employees.length === allEmployees.length;
  }

  const closeButtonHandler = useCallback((item: Employee): void => {
    const newEmployees = [...employees];
    const index = newEmployees.indexOf(item);

    newEmployees.splice(index, 1);
    setEmployees(newEmployees);

    if (index >= newEmployees.length && index > 0) {
      setSelectedItem(newEmployees[index - 1]);
    }
  }, [employees]);

  const renderTitle = useCallback((data: Employee) => (
    <>
      <span>
        {data.FirstName} {data.LastName}
      </span>
      {employees.length >= 2 && <i className="dx-icon dx-icon-close" onClick={(): void => { closeButtonHandler(data); }} />}
    </>
  ), [employees, closeButtonHandler]);

  const onSelectionChanged = useCallback((args: TabPanelTypes.SelectionChangedEvent): void => {
    setSelectedItem(args.addedItems[0]);
  }, [setSelectedItem]);

  const onTabDragStart = useCallback((e: SortableTypes.DragStartEvent): void => {
    e.itemData = e.fromData[e.fromIndex];
  }, []);

  const onTabDrop = useCallback((e: SortableTypes.ReorderEvent): void => {
    const newEmployees = [...employees];

    newEmployees.splice(e.fromIndex, 1);
    newEmployees.splice(e.toIndex, 0, e.itemData);

    setEmployees(newEmployees);
  }, [employees, setEmployees]);

  return (
    <>
      <div id="container">
        <Button
          disabled={disableButton()}
          text="Add Tab"
          icon="add"
          type="default"
          onClick={addButtonHandler}
        />
      </div>
      <Sortable
        filter=".dx-tab"
        data={employees}
        itemOrientation="horizontal"
        dragDirection="horizontal"
        onDragStart={onTabDragStart}
        onReorder={onTabDrop}
      >
        <TabPanel
          dataSource={employees}
          height={410}
          itemTitleRender={renderTitle}
          deferRendering={false}
          showNavButtons={true}
          selectedItem={selectedItem}
          repaintChangesOnly={true}
          onSelectionChanged={onSelectionChanged}
          itemComponent={EmployeeTemplate}
        />
      </Sortable>
    </>
  );
}

export default App;
