import React from 'react';
import { Form, Item } from 'devextreme-react/form';
import type { TextBoxTypes } from 'devextreme-react/text-box';

const items = ['Address', 'City', 'Region', 'PostalCode', 'Country', 'Phone'];

interface FormItemRenderData {
  editorOptions: TextBoxTypes.Properties;
}

const renderFormItem = (item: FormItemRenderData) => (
  <span>{item.editorOptions.value}</span>
);

interface AddressTabProps {
  data: any;
}

const AddressTab = (props: AddressTabProps) => (
  <Form
    formData={props.data}
    colCount={2}
    className="address-form form-container"
  >
    {
      items.map((item, index) => <Item
        dataField={item}
        key={index}
        render={renderFormItem}
      />)
    }
  </Form>
);

export default AddressTab;
