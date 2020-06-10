import React from 'react';
import 'devextreme-react/text-area';

import Form, { Item } from 'devextreme-react/form';
import service from './data.js';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.employee = service.getEmployee();
    this.positions = service.getPositions();
    this.rules = { 'X': /[02-9]/ };

    this.validationRules = {
      position: [
        { type: 'required', message: 'Position is required.' },
      ],
      hireDate: [
        { type: 'required', message: 'Hire Date is required.' }
      ]
    };

    this.validateForm = (e) => {
      e.component.validate();
    };
  }

  render() {
    return (
      <React.Fragment>
        <div className="long-title"><h3>Employee Details</h3></div>
        <div className="form-container">
          <Form
            onContentReady={this.validateForm}
            colCount={2}
            id="form"
            formData={this.employee}>
            <Item dataField="FirstName" editorOptions={{ disabled: true }} />
            <Item dataField="Position" editorType="dxSelectBox" editorOptions={{ items: this.positions, searchEnabled: true, value: '' }} validationRules={this.validationRules.position} />
            <Item dataField="LastName" editorOptions={{ disabled: true }} />
            <Item dataField="HireDate" editorType="dxDateBox" editorOptions={{ width: '100%', value: null }} validationRules={this.validationRules.hireDate} />
            <Item dataField="BirthDate" editorType="dxDateBox" editorOptions={{ width: '100%', disabled: true }} />
            <Item dataField="Address" />
            <Item dataField="Notes" colSpan={2} editorType="dxTextArea" editorOptions={{ height: 90 }} />
            <Item dataField="Phone" editorOptions={{ mask: '+1 (X00) 000-0000', maskRules: this.rules }} />
            <Item dataField="Email" />
          </Form>
        </div>
      </React.Fragment>
    );
  }
}

export default App;
