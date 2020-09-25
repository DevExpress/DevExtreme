import React from 'react';
import { Button } from 'devextreme-react';
import { Sortable } from 'devextreme-react/sortable';
import TabPanel from 'devextreme-react/tab-panel';
import 'devextreme/data/odata/store';

import service from './data.js';
import EmployeeTemplate from './EmployeeTemplate.js';

const allEmployees = service.getEmployees();

function App() {
  const [employees, setEmployees] = React.useState(allEmployees.slice(0, 3));
  const [selectedItem, setSelectedItem] = React.useState(allEmployees[0]);

  function addButtonHandler() {
    const newItem = allEmployees
      .filter((employee) => employees.indexOf(employee) === -1)[0];

    setEmployees([...employees, newItem]);
    setSelectedItem(newItem);
  }

  function disableButton() {
    return employees.length === allEmployees.length;
  }

  function closeButtonHandler(item) {
    const newEmployees = [...employees];
    const index = newEmployees.indexOf(item);

    newEmployees.splice(index, 1);
    setEmployees(newEmployees);

    if (index >= newEmployees.length && index > 0) {
      setSelectedItem(newEmployees[index - 1]);
    }
  }

  function renderTitle(data) {
    function closeHandler() {
      closeButtonHandler(data);
    }
    return (
      <React.Fragment>
        <div>
          <span>
            {data.FirstName} {data.LastName}
          </span>
          {employees.length >= 2 && <i className="dx-icon dx-icon-close" onClick={closeHandler} />}
        </div>
      </React.Fragment>
    );
  }

  function onSelectionChanged(args) {
    setSelectedItem(args.addedItems[0]);
  }

  function onTabDragStart(e) {
    e.itemData = e.fromData[e.fromIndex];
  }

  function onTabDrop(e) {
    const newEmployees = [...employees];

    newEmployees.splice(e.fromIndex, 1);
    newEmployees.splice(e.toIndex, 0, e.itemData);

    setEmployees(newEmployees);
  }

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
          height={472}
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
