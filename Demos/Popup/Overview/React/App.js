import React from 'react';

import { Popup } from 'devextreme-react/popup';
import { EmployeeItem } from './EmployeeItem.js';
import { employees } from './data.js';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentEmployee: {},
      popupVisible: false
    };

    this.showInfo = this.showInfo.bind(this);
    this.hideInfo = this.hideInfo.bind(this);
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
          width={300}
          height={250}
        >
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
      popupVisible: true
    });
  }

  hideInfo() {
    this.setState({
      currentEmployee: {},
      popupVisible: false
    });
  }
}

export default App;
