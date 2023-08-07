import React from 'react';
import 'devextreme-react/text-area';

import Form, { GroupItem, SimpleItem, Label } from 'devextreme-react/form';
import service from './data.js';

const employee = service.getEmployee();

const App = () => {
  const [phoneOptions, setPhoneOptions] = React.useState();
  const [isHomeAddressVisible, setIsHomeAddressVisible] = React.useState(true);
  const getCheckBoxOptions = React.useCallback(() => ({
    text: 'Show Address',
    value: true,
    onValueChanged: (e) => {
      setIsHomeAddressVisible(e.component.option('value'));
    },
  }), [setIsHomeAddressVisible]);

  const getPhoneButtonOptions = React.useCallback(() => ({
    icon: 'add',
    text: 'Add phone',
    onClick: () => {
      employee.Phones.push('');
      updatePhones();
    },
  }), [updatePhones]);

  React.useEffect(() => {
    setPhoneOptions(getPhonesOptions());
  }, [setPhoneOptions, getPhonesOptions]);

  const generateNewPhoneOptions = React.useCallback((index) => ({
    mask: '+1 (X00) 000-0000',
    maskRules: { X: /[01-9]/ },
    buttons: [{
      name: 'trash',
      location: 'after',
      options: {
        stylingMode: 'text',
        icon: 'trash',
        onClick: () => {
          employee.Phones.splice(index, 1);
          updatePhones();
        },
      },
    }],
  }), [updatePhones]);

  const getPhonesOptions = React.useCallback(() => {
    const options = [];
    for (let i = 0; i < employee.Phones.length; i += 1) {
      options.push(generateNewPhoneOptions(i));
    }
    return options;
  }, [generateNewPhoneOptions]);

  const updatePhones = React.useCallback(() => {
    setPhoneOptions(getPhonesOptions());
  }, [setPhoneOptions, getPhonesOptions]);

  const phoneItems = React.useCallback(() => phoneOptions
    && phoneOptions.map((phone, index) => <SimpleItem
      key={`Phones${index}`}
      dataField={`Phones[${index}]`}
      editorOptions={phone}>
      <Label text={`Phone ${index + 1}`} />
    </SimpleItem>), [phoneOptions]);

  return (
    <React.Fragment>
      <div className="long-title"><h3>Personal details</h3></div>
      <div className="form-container">
        <Form
          colCount={2}
          id="form"
          formData={employee}>
          <GroupItem>
            <GroupItem>
              <GroupItem caption="Personal Data">
                <SimpleItem dataField="FirstName" />
                <SimpleItem dataField="LastName" />
                <SimpleItem editorType="dxCheckBox" editorOptions={getCheckBoxOptions()} />
              </GroupItem>
            </GroupItem>
            <GroupItem>
              <GroupItem caption="Home Address"
                name="HomeAddress"
                visible={isHomeAddressVisible}>
                <SimpleItem dataField="Address" />
                <SimpleItem dataField="City" />
              </GroupItem>
            </GroupItem>
          </GroupItem>
          <GroupItem caption="Phones"
            name="phones-container">
            <GroupItem
              name="phones">
              {phoneItems()}
            </GroupItem>
            <SimpleItem itemType="button"
              horizontalAlignment="left"
              cssClass="add-phone-button"
              buttonOptions={getPhoneButtonOptions()}>
            </SimpleItem>
          </GroupItem>
        </Form>
      </div>
    </React.Fragment>
  );
};

export default App;
