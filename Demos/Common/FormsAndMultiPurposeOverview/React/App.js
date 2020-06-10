import React from 'react';

import { employee, positions, states } from './data.js';

import Form, {
  SimpleItem,
  GroupItem,
  Label
} from 'devextreme-react/form';
import 'devextreme-react/text-area';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.birthDateOptions = { width: '100%' };
    this.positionOptions = {
      items: positions,
      value: ''
    };
    this.stateOptions = {
      items: states
    };
    this.phoneOptions = { mask: '+1 (000) 000-0000' };
    this.notesOptions = { height: 140 };
  }
  render() {
    return (
      <Form formData={employee}>
        <GroupItem cssClass="first-group" colCount={4}>
          <SimpleItem render={avatarRender}>
          </SimpleItem>
          <GroupItem colSpan={3}>
            <SimpleItem dataField="FirstName" />
            <SimpleItem dataField="LastName" />
            <SimpleItem
              dataField="BirthDate"
              editorType="dxDateBox"
              editorOptions={this.birthDateOptions}
            />
          </GroupItem>
        </GroupItem>
        <GroupItem cssClass="second-group" colCount={2}>
          <GroupItem>
            <SimpleItem dataField="Address" />
            <SimpleItem dataField="City" />
            <SimpleItem dataField="Position"
              editorType="dxSelectBox"
              editorOptions={this.positionOptions} />
          </GroupItem>
          <GroupItem>
            <SimpleItem
              dataField="State"
              editorType="dxSelectBox"
              editorOptions={this.stateOptions} />
            <SimpleItem dataField="ZipCode" />
            <SimpleItem
              dataField="Mobile"
              editorOptions={this.phoneOptions}>
              <Label text="Phone" />
            </SimpleItem>
          </GroupItem>
          <SimpleItem
            colSpan={2}
            dataField="Notes"
            editorType="dxTextArea"
            editorOptions={this.notesOptions}
          />
        </GroupItem>
      </Form>
    );
  }
}

function avatarRender() {
  return (
    <div className="form-avatar"></div>
  );
}

export default App;
