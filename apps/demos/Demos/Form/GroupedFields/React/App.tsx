import React from 'react';
import 'devextreme-react/text-area';
import Form, {
  SimpleItem, GroupItem, TabbedItem, TabPanelOptions, Tab,
} from 'devextreme-react/form';
import service from './data.ts';

const employee = service.getEmployee();

export default function App() {
  function groupCaptionTemplate(icon){
    return (data) => {
      return `<i class='dx-icon dx-icon-${icon}'></i><span>${data.caption}</span>`;
    }
  }
  return (
    <React.Fragment>
      <div className="long-title"><h3>Personal details</h3></div>
      <div className="form-container">
        <Form
          colCount={2}
          id="form"
          formData={employee}>
          <GroupItem captionTemplate={groupCaptionTemplate('info')} caption="System Information">
            <SimpleItem dataField="ID" />
            <GroupItem captionTemplate={groupCaptionTemplate('user')} caption="Main Information">
              <SimpleItem dataField="FirstName" />
              <SimpleItem dataField="LastName" />
              <SimpleItem dataField="HireDate" />
              <SimpleItem dataField="Position" />
              <SimpleItem dataField="OfficeNo" />
            </GroupItem>
          </GroupItem>
          <GroupItem captionTemplate={groupCaptionTemplate('accountbox')} caption="Personal Data">
            <SimpleItem dataField="BirthDate" />
            <GroupItem captionTemplate={groupCaptionTemplate('home')} caption='Home Address'>
              <SimpleItem dataField="Address" />
              <SimpleItem dataField="City" />
              <SimpleItem dataField="State" />
              <SimpleItem dataField="Zipcode" />
            </GroupItem>
          </GroupItem>
          <GroupItem captionTemplate={groupCaptionTemplate('tel')} caption="Contact Information">
            <TabbedItem>
              <TabPanelOptions deferRendering={false} />
              <Tab title="Phone">
                <SimpleItem dataField="Phone" />
              </Tab>
              <Tab title="Skype">
                <SimpleItem dataField="Skype" />
              </Tab>
              <Tab title="Email">
                <SimpleItem dataField="Email" />
              </Tab>
            </TabbedItem>
          </GroupItem>
        </Form>
      </div>
    </React.Fragment>
  );
}
