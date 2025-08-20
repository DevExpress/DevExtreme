import React from "react";

import {
  Form,
  SimpleItem,
  RequiredRule,
} from "devextreme-react/form";
import { Button } from "devextreme-react/button";
import { SelectBox } from "devextreme-react/select-box";
import { Validator } from "devextreme-react/validator";
import { ValidationSummary } from "devextreme-react/validation-summary";

const groupName = "sharedGroup";

const onClick = (e) => {
  return e.validationGroup?.validate();
};

const items = [
  {
    id: 1,
    description: "One",
  },
];

const SelectBoxWithValidator = () => {
  const [formData, setFormData] = React.useState({ code: null, type: null });

  const valueChanged = React.useCallback((e) => {
    setFormData((prevFormData) => {
      return {
        ...prevFormData,
        type: e.value,
      };
    });
  }, []);

  return (
    <>
      <Form validationGroup={groupName} formData={formData}>
        <SimpleItem>
          <SelectBox
            value={formData.type}
            onValueChanged={valueChanged}
            items={items}
            showClearButton
            valueExpr={'id'}
            displayExpr={'description'}
          >
            <Validator validationGroup={groupName}>
              <RequiredRule message='Type is required' />
            </Validator>
          </SelectBox>
        </SimpleItem>
      </Form>
      <ValidationSummary validationGroup={groupName} />
      <Button validationGroup={groupName} text='Validate' onClick={onClick} />
    </>
  );
}



export default SelectBoxWithValidator;
