import React from 'react';
import {
  Form, SimpleItem, GroupItem, Label,
} from 'devextreme-react/form';
import { employee, positions, states } from './data.js';
import 'devextreme-react/text-area';

const birthDateOptions = { width: '100%' };
const positionOptions = {
  items: positions,
  value: '',
};
const stateOptions = {
  items: states,
};
const phoneOptions = { mask: '+1 (000) 000-0000' };
const notesOptions = { height: 140 };

const avatarRender = () => (
  <div className="form-avatar"></div>
);

export default function App() {
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
            editorOptions={birthDateOptions}
          />
        </GroupItem>
      </GroupItem>
      <GroupItem cssClass="second-group" colCount={2}>
        <GroupItem>
          <SimpleItem dataField="Address" />
          <SimpleItem dataField="City" />
          <SimpleItem dataField="Position"
            editorType="dxSelectBox"
            editorOptions={positionOptions} />
        </GroupItem>
        <GroupItem>
          <SimpleItem
            dataField="State"
            editorType="dxSelectBox"
            editorOptions={stateOptions} />
          <SimpleItem dataField="ZipCode" />
          <SimpleItem
            dataField="Mobile"
            editorOptions={phoneOptions}>
            <Label text="Phone" />
          </SimpleItem>
        </GroupItem>
        <SimpleItem
          colSpan={2}
          dataField="Notes"
          editorType="dxTextArea"
          editorOptions={notesOptions}
        />
      </GroupItem>
    </Form>
  );
}
