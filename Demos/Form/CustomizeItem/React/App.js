import React from 'react';
import 'devextreme-react/text-area';

import Form, { Item } from 'devextreme-react/form';
import service from './data.js';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.employee = service.getEmployee();
    this.positions = service.getPositions();
    this.rules = { X: /[02-9]/ };

    this.validationRules = {
      position: [
        { type: 'required', message: 'Position is required.' },
      ],
      hireDate: [
        { type: 'required', message: 'Hire Date is required.' },
      ],
    };

    this.nameEditorOptions = { disabled: true };
    this.positionEditorOptions = { items: this.positions, searchEnabled: true, value: '' };
    this.hireDateEditorOptions = { width: '100%', value: null };
    this.birthDateEditorOptions = { width: '100%', disabled: true };
    this.notesEditorOptions = { height: 90 };
    this.phonesEditorOptions = { mask: '+1 (X00) 000-0000', maskRules: this.rules };

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
            <Item dataField="FirstName" editorOptions={this.nameEditorOptions} />
            <Item dataField="Position" editorType="dxSelectBox" editorOptions={this.positionEditorOptions} validationRules={this.validationRules.position} />
            <Item dataField="LastName" editorOptions={this.nameEditorOptions} />
            <Item dataField="HireDate" editorType="dxDateBox" editorOptions={this.hireDateEditorOptions} validationRules={this.validationRules.hireDate} />
            <Item dataField="BirthDate" editorType="dxDateBox" editorOptions={this.birthDateEditorOptions} />
            <Item dataField="Address" />
            <Item dataField="Notes" colSpan={2} editorType="dxTextArea" editorOptions={this.notesEditorOptions} />
            <Item dataField="Phone" editorOptions={this.phonesEditorOptions} />
            <Item dataField="Email" />
          </Form>
        </div>
      </React.Fragment>
    );
  }
}

export default App;
