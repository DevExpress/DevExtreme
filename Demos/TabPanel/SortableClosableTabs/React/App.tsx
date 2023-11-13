import React from 'react';
import Button from 'devextreme-react/button';
import Sortable, { SortableTypes } from 'devextreme-react/sortable';
import TabPanel, { TabPanelTypes } from 'devextreme-react/tab-panel';
import 'devextreme/data/odata/store';

import service from './data.ts';
import EmployeeTemplate from './EmployeeTemplate.tsx';

const allEmployees = service.getEmployees();

function App() {
  const [employees, setEmployees] = React.useState(allEmployees.slice(0, 3));
  const [selectedItem, setSelectedItem] = React.useState(allEmployees[0]);

  const addButtonHandler = React.useCallback(() => {
    const newItem = allEmployees
      .filter((employee) => employees.indexOf(employee) === -1)[0];

    setEmployees([...employees, newItem]);
    setSelectedItem(newItem);
  }, [employees, setEmployees, setSelectedItem]);

  function disableButton() {
    return employees.length === allEmployees.length;
  }

  const closeButtonHandler = React.useCallback((item) => {
    const newEmployees = [...employees];
    const index = newEmployees.indexOf(item);

    newEmployees.splice(index, 1);
    setEmployees(newEmployees);

    if (index >= newEmployees.length && index > 0) {
      setSelectedItem(newEmployees[index - 1]);
    }
  }, [employees, setEmployees, setSelectedItem]);

  const renderTitle = React.useCallback((data) => (
    <React.Fragment>
      <div>
        <span>
          {data.FirstName} {data.LastName}
        </span>
        {employees.length >= 2 && <i className="dx-icon dx-icon-close" onClick={() => { closeButtonHandler(data); }} />}
      </div>
    </React.Fragment>
  ), [employees, closeButtonHandler]);

  const onSelectionChanged = React.useCallback((args: TabPanelTypes.SelectionChangedEvent) => {
    setSelectedItem(args.addedItems[0]);
  }, [setSelectedItem]);

  const onTabDragStart = React.useCallback((e: SortableTypes.DragStartEvent) => {
    e.itemData = e.fromData[e.fromIndex];
  }, []);

  const onTabDrop = React.useCallback((e: SortableTypes.ReorderEvent) => {
    const newEmployees = [...employees];

    newEmployees.splice(e.fromIndex, 1);
    newEmployees.splice(e.toIndex, 0, e.itemData);

    setEmployees(newEmployees);
  }, [employees, setEmployees]);

  return (
    <React.Fragment>
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
    </React.Fragment>
  );
}

export default App;
