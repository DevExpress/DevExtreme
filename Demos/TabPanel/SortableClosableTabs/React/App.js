import React from 'react';
import { Button } from 'devextreme-react';
import { Sortable } from 'devextreme-react/sortable';
import TabPanel from 'devextreme-react/tab-panel';
import 'devextreme/data/odata/store';

import service from './data.js';
import EmployeeTemplate from './EmployeeTemplate.js';
import { CloseButton } from './CloseButton.js';

const allEmployees = service.getEmployees();

class App extends React.Component {
  constructor() {
    super();

    this.state = {
      employees: allEmployees.slice(0, 3),
      selectedItem: allEmployees[0]
    };
  }

  render() {
    return (
      <div>
        <div id="container">
          <Button
            disabled={this.disableButton()}
            text="Add Tab"
            icon="add"
            type="default"
            onClick={this.addButtonHandler}
          />
        </div>
        <Sortable
          filter=".dx-tab"
          data={this.state.employees}
          itemOrientation ="horizontal"
          dragDirection="horizontal"
          onDragStart={this.onTabDragStart}
          onReorder={this.onTabDrop}
        >
          <TabPanel
            dataSource={this.state.employees}
            height={472}
            itemTitleRender={this.renderTitle}
            deferRendering={false}
            showNavButtons={true}
            selectedItem={this.state.selectedItem}
            repaintChangesOnly={true}
            onSelectionChanged={this.onSelectionChanged}
            itemComponent={EmployeeTemplate}>
          </TabPanel>
        </Sortable>
      </div>
    );
  }

  onTabDragStart = (e) => {
    e.itemData = e.fromData[e.fromIndex];
  }

  onTabDrop = (e) => {
    const employees = [...this.state.employees];
    const selectedItem = employees[e.fromIndex];

    employees.splice(e.fromIndex, 1);
    employees.splice(e.toIndex, 0, e.itemData);

    this.setState({
      selectedItem,
      employees,
     
    });
  }

  renderTitle = (data) => {
    return (
      <div>
        <span>{data.FirstName} {data.LastName}</span>
        <CloseButton showCloseButton={this.state.employees.length > 1} onItemClick={this.closeButtonHandler} data={data} />
      </div>
    );
  }

  addButtonHandler = () => {
    const newItem = allEmployees.filter(employee => this.state.employees.indexOf(employee) === -1)[0];
    const employees = [...this.state.employees, newItem];

    this.setState({
      employees,
      selectedItem: newItem
    });
  }

  closeButtonHandler = (itemData) => {
    const employees = [...this.state.employees];
    const index = employees.indexOf(itemData);

    employees.splice(index, 1);

    this.setState({
      employees,
      selectedItem: employees.length ? employees[index] ? employees[index] : employees[index - 1] : null
    });
  }

  disableButton() {
    return this.state.employees.length === allEmployees.length;
  }

  onSelectionChanged = (args) => {
    this.setState({
      selectedItem: args.addedItems[0]
    });
  }
}

export default App;
