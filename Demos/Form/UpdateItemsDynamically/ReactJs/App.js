import React from 'react';
import 'devextreme-react/text-area';
import Form, {
  GroupItem, SimpleItem, Label, ButtonItem,
} from 'devextreme-react/form';
import service from './data.js';

const employee = service.getEmployee();
const App = () => {
  const [phones, setPhones] = React.useState(employee.Phones);
  const [isHomeAddressVisible, setIsHomeAddressVisible] = React.useState(true);
  const formData = React.useMemo(() => ({ ...employee, Phones: phones }), [phones]);
  const CheckBoxOptions = React.useMemo(
    () => ({
      text: 'Show Address',
      value: isHomeAddressVisible,
      onValueChanged: (e) => {
        setIsHomeAddressVisible(e.component.option('value'));
      },
    }),
    [setIsHomeAddressVisible, isHomeAddressVisible],
  );
  const generateNewPhoneOptions = React.useCallback(
    (index) => ({
      mask: '+1 (X00) 000-0000',
      maskRules: { X: /[01-9]/ },
      buttons: [
        {
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
        },
      ],
    }),
    [phones],
  );
  const PhoneOptions = React.useMemo(() => {
    const options = [];
    for (let i = 0; i < phones.length; i += 1) {
      options.push(generateNewPhoneOptions(i));
    }
    return options;
  }, [phones, generateNewPhoneOptions]);
  const PhoneButtonOptions = React.useMemo(
    () => ({
      icon: 'add',
      text: 'Add phone',
      onClick: () => {
        setPhones((prevPhones) => [...prevPhones, '']);
      },
    }),
    [],
  );
  return (
    <React.Fragment>
      <div className="long-title">
        <h3>Personal details</h3>
      </div>
      <div className="form-container">
        <Form
          colCount={2}
          id="form"
          formData={formData}
        >
          <GroupItem>
            <GroupItem>
              <GroupItem caption="Personal Data">
                <SimpleItem dataField="FirstName" />
                <SimpleItem dataField="LastName" />
                <SimpleItem
                  editorType="dxCheckBox"
                  editorOptions={CheckBoxOptions}
                />
              </GroupItem>
            </GroupItem>
            <GroupItem>
              <GroupItem
                caption="Home Address"
                name="HomeAddress"
                visible={isHomeAddressVisible}
              >
                <SimpleItem dataField="Address" />
                <SimpleItem dataField="City" />
              </GroupItem>
            </GroupItem>
          </GroupItem>
          <GroupItem
            caption="Phones"
            name="phones-container"
          >
            <GroupItem name="phones">
              {PhoneOptions.map((phone, index) => (
                <SimpleItem
                  key={`Phones${index}`}
                  dataField={`Phones[${index}]`}
                  editorOptions={phone}
                >
                  <Label text={`Phone ${index + 1}`} />
                </SimpleItem>
              ))}
            </GroupItem>

            <ButtonItem
              horizontalAlignment="left"
              cssClass="add-phone-button"
              buttonOptions={PhoneButtonOptions}
            ></ButtonItem>
          </GroupItem>
        </Form>
      </div>
    </React.Fragment>
  );
};
export default App;
