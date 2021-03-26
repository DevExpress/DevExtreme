import React from 'react';

import { Popup, Position, ToolbarItem } from 'devextreme-react/popup';
import { EmployeeItem } from './EmployeeItem.js';
import { employees } from './data.js';
import notify from 'devextreme/ui/notify';

class App extends React.Component {
  emailButtonOptions = null;
  closeButtonOptions = null;

  constructor(props) {
    super(props);
    this.state = {
      currentEmployee: {},
      popupVisible: false,
      positionOf: ''
    };
    this.showInfo = this.showInfo.bind(this);
    this.hideInfo = this.hideInfo.bind(this);
    this.emailButtonOptions = {
      icon: 'email',
      text: 'Send',
      onClick: this.sendEmail.bind(this)
    };
    this.closeButtonOptions = {
      text: 'Close',
      onClick: this.hideInfo
    };
  }

  render() {
    const items = employees.map((employee) =>
      <li key={employee.ID}>
        <EmployeeItem
          employee={employee}
          showInfo={this.showInfo}
        />
      </li>
    );

    return (
      <div id="container">

        <h1>Employees</h1>

        <ul>{items}</ul>

        <Popup
          visible={this.state.popupVisible}
          onHiding={this.hideInfo}
          dragEnabled={false}
          closeOnOutsideClick={true}
          showTitle={true}
          title="Information"
          container=".dx-viewport"
          width={300}
          height={280}
        >
          <Position
            at="bottom"
            my="center"
            of={this.state.positionOf}
          />
          <ToolbarItem
            widget="dxButton"
            toolbar="bottom"
            location="before"
            options={this.emailButtonOptions}
          />
          <ToolbarItem
            widget="dxButton"
            toolbar="bottom"
            location="after"
            options={this.closeButtonOptions}
          />
          <p>
            Full Name:&nbsp;
            <span>{this.state.currentEmployee.FirstName}</span>&nbsp;
            <span>{this.state.currentEmployee.LastName}</span>
          </p>
          <p>
            Birth Date: <span>{this.state.currentEmployee.BirthDate}</span>
          </p>
          <p>
            Address: <span>{this.state.currentEmployee.Address}</span>
          </p>
          <p>
            Hire Date: <span>{this.state.currentEmployee.HireDate}</span>
          </p>
          <p>
            Position: <span>{this.state.currentEmployee.Position}</span>
          </p>
        </Popup>
      </div>
    );
  }

  showInfo(employee) {
    this.setState({
      currentEmployee: employee,
      positionOf: `#image${employee.ID}`,
      popupVisible: true
    });
  }

  hideInfo() {
    this.setState({
      currentEmployee: {},
      popupVisible: false
    });
  }

  sendEmail() {
    const message = `Email is sent to ${this.state.currentEmployee.FirstName} ${this.state.currentEmployee.LastName}`;
    notify({
      message: message,
      position: {
        my: 'center top',
        at: 'center top'
      }
    }, 'success', 3000);
  }
}

export default App;
