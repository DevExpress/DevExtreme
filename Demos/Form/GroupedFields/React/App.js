import React from 'react';
import 'devextreme-react/text-area';

import Form, { SimpleItem, GroupItem, TabbedItem, TabPanelOptions, Tab } from 'devextreme-react/form';
import service from './data.js';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.employee = service.getEmployee();
  }

  render() {
    return (
      <React.Fragment>
        <div className="long-title"><h3>Personal details</h3></div>
        <div className="form-container">
          <Form
            colCount={2}
            id="form"
            formData={this.employee}>
            <GroupItem caption="System Information">
              <SimpleItem dataField="ID" />
              <SimpleItem dataField="FirstName" />
              <SimpleItem dataField="LastName" />
              <SimpleItem dataField="HireDate" />
              <SimpleItem dataField="Position" />
              <SimpleItem dataField="OfficeNo" />
            </GroupItem>
            <GroupItem caption="Personal Data">
              <SimpleItem dataField="BirthDate" />
              <GroupItem caption='Home Address'>
                <SimpleItem dataField="Address" />
                <SimpleItem dataField="City" />
                <SimpleItem dataField="State" />
                <SimpleItem dataField="Zipcode" />
              </GroupItem>
            </GroupItem>
            <GroupItem caption="Contact Information">
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
}

export default App;
