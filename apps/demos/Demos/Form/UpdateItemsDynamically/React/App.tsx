import React, { useCallback, useMemo, useState } from 'react';
import 'devextreme-react/text-area';
import Form, {
  GroupItem,
  SimpleItem,
  Label,
  ButtonItem,
} from 'devextreme-react/form';
import type { CheckBoxTypes, ICheckBoxOptions } from 'devextreme-react/check-box';
import type { ITextBoxOptions } from 'devextreme-react/text-box';
import type { IButtonOptions } from 'devextreme-react/button';
import { employee } from './data.ts';
import type { Employee } from './types.ts';

const App = () => {
  const [phones, setPhones] = useState<string[]>(employee.Phones);
  const [isHomeAddressVisible, setIsHomeAddressVisible] = useState<CheckBoxTypes.Properties['value']>(true);

  const formData = useMemo((): Employee => ({ ...employee, Phones: phones }), [phones]);

  const CheckBoxOptions = useMemo((): ICheckBoxOptions => ({
    text: 'Show Address',
    value: isHomeAddressVisible,
    onValueChanged: (e: CheckBoxTypes.ValueChangedEvent): void => {
      setIsHomeAddressVisible(e.component.option('value'));
    },
  }), [isHomeAddressVisible]);

  const generateNewPhoneOptions = useCallback((index: number): ITextBoxOptions => ({
    mask: '(X00) 000-0000',
    maskRules: { X: /[01-9]/ },
    buttons: [{
      name: 'trash',
      location: 'after',
      options: {
        stylingMode: 'text',
        icon: 'trash',
        onClick: (): void => {
          const newPhones = phones.slice(0, index).concat(phones.slice(index + 1));
          setPhones(newPhones);
        },
      },
    }],
  }), [phones]);

  const PhoneOptions = useMemo((): ITextBoxOptions[] => {
    const options: ITextBoxOptions[] = [];
    for (let i = 0; i < phones.length; i += 1) {
      options.push(generateNewPhoneOptions(i));
    }
    return options;
  }, [phones, generateNewPhoneOptions]);

  const PhoneButtonOptions = useMemo((): IButtonOptions => ({
    icon: 'add',
    text: 'Add phone',
    onClick: (): void => {
      setPhones((prevPhones: string[]): string[] => [...prevPhones, '']);
    },
  }), []);

  return (
    <>
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
              <GroupItem caption="Home Address"
                name="HomeAddress"
                visible={!!isHomeAddressVisible}>
                <SimpleItem dataField="Address" />
                <SimpleItem dataField="City" />
              </GroupItem>
            </GroupItem>
          </GroupItem>
          <GroupItem caption="Phones"
            name="phones-container">
            <GroupItem
              name="phones">
              {PhoneOptions.map((options: ITextBoxOptions, index: number) => <SimpleItem
                key={`Phones${index}`}
                dataField={`Phones[${index}]`}
                editorOptions={options}>
                <Label text={`Phone ${index + 1}`} />
              </SimpleItem>)}
            </GroupItem>

            <ButtonItem
              horizontalAlignment="left"
              cssClass="add-phone-button"
              buttonOptions={PhoneButtonOptions}>
            </ButtonItem>
          </GroupItem>
        </Form>
      </div>
    </>
  );
};

export default App;
