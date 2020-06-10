import React from 'react';
import 'devextreme-react/text-area';

import Form, { GroupItem, SimpleItem, Label } from 'devextreme-react/form';
import service from './data.js';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.employee = service.getEmployee();

    this.checkBoxOptions = {
      text: 'Show Address',
      value: true,
      onValueChanged: (e) => {
        this.setState({
          isHomeAddressVisible: e.component.option('value')
        });
      }
    };

    this.addPhoneButtonOptions = {
      icon: 'add',
      text: 'Add phone',
      onClick: () => {
        this.employee.Phones.push('');
        this.updatePhones();
      }
    };

    this.state = {
      phoneOptions: this.getPhonesOptions(),
      isHomeAddressVisible: true
    };

    this.generateNewPhoneOptions = this.generateNewPhoneOptions.bind(this);
    this.getPhonesOptions = this.getPhonesOptions.bind(this);
    this.updatePhones = this.updatePhones.bind(this);
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
            <GroupItem>
              <GroupItem>
                <GroupItem caption="Personal Data">
                  <SimpleItem dataField="FirstName" />
                  <SimpleItem dataField="LastName" />
                  <SimpleItem editorType="dxCheckBox" editorOptions={this.checkBoxOptions} />
                </GroupItem>
              </GroupItem>
              <GroupItem>
                <GroupItem caption="Home Address"
                  name="HomeAddress"
                  visible={this.state.isHomeAddressVisible}>
                  <SimpleItem dataField="Address" />
                  <SimpleItem dataField="City" />
                </GroupItem>
              </GroupItem>
            </GroupItem>
            <GroupItem caption="Phones"
              name="phones-container">
              <GroupItem
                name="phones">
                { this.state.phoneOptions.map((phone, index) =>
                  <SimpleItem
                    key = {`Phones${ index}`}
                    dataField={`Phones[${index}]`}
                    editorOptions={phone}>
                    <Label text={`Phone ${ index + 1}`} />
                  </SimpleItem>
                )}
              </GroupItem>
              <SimpleItem itemType="button"
                horizontalAlignment="left"
                cssClass="add-phone-button"
                buttonOptions={this.addPhoneButtonOptions}>
              </SimpleItem>
            </GroupItem>
          </Form>
        </div>
      </React.Fragment>
    );
  }

  getPhonesOptions() {
    var options = [];
    for (var i = 0; i < this.employee.Phones.length; i++) {
      options.push(this.generateNewPhoneOptions(i));
    }
    return options;
  }

  generateNewPhoneOptions(index) {
    return {
      mask: '+1 (X00) 000-0000',
      maskRules: { 'X': /[01-9]/ },
      buttons: [{
        name: 'trash',
        location: 'after',
        options: {
          stylingMode: 'text',
          icon: 'trash',
          onClick: () => {
            this.employee.Phones.splice(index, 1);
            this.updatePhones();
          }
        }
      }]
    };
  }

  updatePhones() {
    this.setState({
      phoneOptions: this.getPhonesOptions()
    });
  }
}

export default App;
