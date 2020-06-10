import React from 'react';
import { Button } from 'devextreme-react';
import { Sortable } from 'devextreme-react/sortable';
import TabPanel from 'devextreme-react/tab-panel';
import 'devextreme/data/odata/store';

import service from './data.js';
import EmployeeTemplate from './EmployeeTemplate.js';
import CloseButtonTemplate from './CloseButtonTemplate.js';

const allEmployees = service.getEmployees();

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      employees: allEmployees.slice(0, 3),
      selectedItem: allEmployees[0],
      isAddButtonDisabled: false,
      isRemoveButtonDisabled: false
    };
  }

  render() {
    return (
      <div>
        <div id="container">
          <Button
            disabled={this.state.isAddButtonDisabled}
            text="Add Tab"
            icon="add"
            type="default"
            onClick={this.addButtonHandler}
          />
          <Button
            disabled={this.state.isRemoveButtonDisabled}
            text="Remove Tab"
            icon="trash"
            type="danger"
            stylingMode="outlined"
            onClick={this.removeButtonHandler}
          />
        </div>
        <Sortable
          filter=".dx-tab"
          data={this.state.employees}
          itemOrientation ="horizontal"
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
            animationEnabled={true}
            onOptionChanged={this.onSelectionChanged}
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
    const employees = this.state.employees.slice();
    const selectedItem = employees[e.fromIndex];

    employees.splice(e.fromIndex, 1);
    employees.splice(e.toIndex, 0, e.itemData);

    this.setState({
      employees,
      selectedItem
    });
  }

  renderTitle = (data) => {
    return (
      <div>
        <span>{data.FirstName} {data.LastName}</span>
        {' '}
        <CloseButtonTemplate key={data.ID} item={data} onItemClick={this.closeButtonHandler} />
      </div>
    );
  }

  addButtonHandler = () => {
    let employees = [...this.state.employees];

    const newItem = allEmployees.filter(employee => this.state.employees.indexOf(employee) === -1)[0];
    employees.push(newItem);

    this.setState({
      employees,
      selectedItem: newItem
    });

    this.updateButtonsAppearance();
  }

  removeButtonHandler = () => {
    this.state.selectedItem && this.closeButtonHandler(this.state.selectedItem);
  }

  closeButtonHandler = (itemData) => {
    let employees = [...this.state.employees];

    const index = employees.indexOf(itemData);
    employees.splice(index, 1);

    this.setState({
      employees,
      selectedItem: employees.length ? employees[index] ? employees[index] : employees[index - 1] : null
    });

    this.updateButtonsAppearance();
  }

  updateButtonsAppearance() {
    this.setState({
      isAddButtonDisabled: this.state.employees.length === allEmployees.length,
      isRemoveButtonDisabled: this.state.employees.length === 0
    });
  }

  onSelectionChanged = (args) => {
    if(args.name == 'selectedItem') {
      this.setState({
        selectedItem: args.value
      });
    }
  }
}

export default App;
