import React, { useCallback, useState } from 'react';
import Button from 'devextreme-react/button';
import Sortable from 'devextreme-react/sortable';
import TabPanel from 'devextreme-react/tab-panel';
import 'devextreme/data/odata/store';
import service from './data.js';
import EmployeeTemplate from './EmployeeTemplate.js';

const allEmployees = service.getEmployees();
function App() {
  const [employees, setEmployees] = useState(allEmployees.slice(0, 3));
  const [selectedItem, setSelectedItem] = useState(allEmployees[0]);
  const addButtonHandler = useCallback(() => {
    const newItem = allEmployees.filter((employee) => employees.indexOf(employee) === -1)[0];
    setEmployees([...employees, newItem]);
    setSelectedItem(newItem);
  }, [employees, setEmployees, setSelectedItem]);
  function disableButton() {
    return employees.length === allEmployees.length;
  }
  const closeButtonHandler = useCallback(
    (item) => {
      const newEmployees = [...employees];
      const index = newEmployees.indexOf(item);
      newEmployees.splice(index, 1);
      setEmployees(newEmployees);
      if (index >= newEmployees.length && index > 0) {
        setSelectedItem(newEmployees[index - 1]);
      }
    },
    [employees, setEmployees, setSelectedItem],
  );
  const renderTitle = useCallback(
    (data) => (
      <React.Fragment>
        <div>
          <span>
            {data.FirstName} {data.LastName}
          </span>
          {employees.length >= 2 && (
            <i
              className="dx-icon dx-icon-close"
              onClick={() => {
                closeButtonHandler(data);
              }}
            />
          )}
        </div>
      </React.Fragment>
    ),
    [employees, closeButtonHandler],
  );
  const onSelectionChanged = useCallback(
    (args) => {
      setSelectedItem(args.addedItems[0]);
    },
    [setSelectedItem],
  );
  const onTabDragStart = useCallback((e) => {
    e.itemData = e.fromData[e.fromIndex];
  }, []);
  const onTabDrop = useCallback(
    (e) => {
      const newEmployees = [...employees];
      newEmployees.splice(e.fromIndex, 1);
      newEmployees.splice(e.toIndex, 0, e.itemData);
      setEmployees(newEmployees);
    },
    [employees, setEmployees],
  );
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
