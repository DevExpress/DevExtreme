import React from 'react';
import 'devextreme-react/text-area';

import Form, { Item } from 'devextreme-react/form';
import service from './data.js';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.employee = service.getEmployee();

    this.groupedItems = {
      systemInformation: [
        'ID', 'FirstName', 'LastName', 'HireDate', 'Position', 'OfficeNo'
      ],
      personalData: [
        'BirthDate',
        {
          itemType: 'group',
          caption: 'Home Address',
          items: ['Address', 'City', 'State', 'Zipcode']
        }

      ],
      contactInformation: [{
        itemType: 'tabbed',
        tabPanelOptions: {
          deferRendering: false
        },
        tabs: [{
          title: 'Phone',
          items: ['Phone']
        }, {
          title: 'Skype',
          items: ['Skype']
        }, {
          title: 'Email',
          items: ['Email']
        }]
      }
      ]
    };
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
            <Item itemType="group" caption="System Information" items={this.groupedItems.systemInformation} />
            <Item itemType="group" caption="Personal Data" items={this.groupedItems.personalData} />
            <Item itemType="group" caption="Contact Information" items={this.groupedItems.contactInformation} />
          </Form>
        </div>
      </React.Fragment>
    );
  }
}

export default App;
