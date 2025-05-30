import React from 'react';
import 'devextreme-react/text-area';
import Form, {
  SimpleItem, GroupItem, TabbedItem, TabPanelOptions, Tab,
} from 'devextreme-react/form';
import GroupCaption from './GroupCaption.tsx';
import service from './data.ts';

const employee = service.getEmployee();

const groupCaptionNamedRender = (iconName) => {
  const groupCaptionRender = (data) =>
    (
      <GroupCaption
        iconName={iconName}
        {...data}
      />
    );
  return groupCaptionRender;
}

export default function App() {
  return (
    <React.Fragment>
      <div className="long-title"><h3>Personal details</h3></div>
      <div className="form-container">
        <Form
          colCount={2}
          id="form"
          formData={employee}>
          <GroupItem captionRender={groupCaptionNamedRender('info')} caption="System Information">
            <SimpleItem dataField="ID" />
            <GroupItem captionRender={groupCaptionNamedRender('user')} caption="Main Information">
              <SimpleItem dataField="FirstName" />
              <SimpleItem dataField="LastName" />
              <SimpleItem dataField="HireDate" />
              <SimpleItem dataField="Position" />
              <SimpleItem dataField="OfficeNo" />
            </GroupItem>
          </GroupItem>
          <GroupItem captionRender={groupCaptionNamedRender('card')} caption="Personal Data">
            <SimpleItem dataField="BirthDate" />
            <GroupItem captionRender={groupCaptionNamedRender('home')} caption='Home Address'>
              <SimpleItem dataField="Address" />
              <SimpleItem dataField="City" />
              <SimpleItem dataField="State" />
              <SimpleItem dataField="Zipcode" />
            </GroupItem>
          </GroupItem>
          <GroupItem captionRender={groupCaptionNamedRender('tel')} caption="Contact Information">
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
