import React, { useCallback, useMemo, useState } from 'react';
import 'devextreme-react/text-area';
import Form, {
  GroupItem, SimpleItem, Label, ButtonItem,
} from 'devextreme-react/form';

const employeeCore = {
    FirstName: 'John',
    LastName: 'Heart',
    Address: '351 S Hill St., Los Angeles, CA',
    City: 'Atlanta',
    Phones: [],
  };

function getEmployee() {
    return employeeCore;
}

const employee = getEmployee();

const InputsListInFormComponent = () => {
  const [phones, setPhones] = useState(employee.Phones);
  const [isHomeAddressVisible, setIsHomeAddressVisible] = useState(true);
  const formData = useMemo(() => ({ ...employee, Phones: phones }), [phones]);

  const CheckBoxOptions = useMemo(() => ({
    text: 'Show Address',
    value: isHomeAddressVisible,
    onValueChanged: (e) => {
      setIsHomeAddressVisible(e.component.option('value'));
    },
  }), [isHomeAddressVisible]);

  const PhoneEditorOptions = useCallback((index) => ({
    mask: '+1 (X00) 000-0000',
    maskRules: { X: /[01-9]/ },
    buttons: [{
      name: 'trash',
      location: 'after',
      options: {
        stylingMode: 'text',
        icon: 'trash',
        onClick: () => {
          const newPhones = phones.slice(0, index).concat(phones.slice(index + 1));
          setPhones(newPhones);
        },
      },
    }],
  }), [phones]);

  const PhoneButtonOptions = useMemo(() => ({
    icon: 'add',
    text: 'Add phone',
    onClick: () => {
      setPhones((prevPhones) => [...prevPhones, '']);
    },
  }), []);

  return (
    <React.Fragment>
      <div className="long-title"><h3>Personal details</h3></div>
      <div className="form-container">
        <Form
          colCount={2}
          id="form"
          formData={formData}>
          <GroupItem>
            <GroupItem>
              <GroupItem caption="Personal Data">
                <SimpleItem dataField="FirstName" />
                <SimpleItem dataField="LastName" />
                <SimpleItem editorType="dxCheckBox" editorOptions={CheckBoxOptions} />
              </GroupItem>
            </GroupItem>
            <GroupItem>
              <GroupItem 
                name="HomeAddress"
                caption="Home Address"
                visible={isHomeAddressVisible}>
                <SimpleItem dataField="Address" />
                <SimpleItem dataField="City" />
              </GroupItem>
            </GroupItem>
          </GroupItem>
          <GroupItem 
            caption="Phones"
            name="phones-container">
            <GroupItem name="phones">
              {phones.map((_, index) => (
                <SimpleItem
                  key={`phone-${index}`}
                  dataField={`Phones[${index}]`}
                  editorOptions={PhoneEditorOptions(index)}>
                  <Label text={`Phone ${index + 1}`} />
                </SimpleItem>
              ))}
            </GroupItem>
            <ButtonItem
              horizontalAlignment="left"
              cssClass="add-phone-button"
              buttonOptions={PhoneButtonOptions}
            />
          </GroupItem>
        </Form>
      </div>
    </React.Fragment>
  );
};

export default InputsListInFormComponent;