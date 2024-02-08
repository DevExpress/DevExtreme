import React from 'react';
import { Form, Item } from 'devextreme-react/form';

const items = ['Address', 'City', 'Region', 'PostalCode', 'Country', 'Phone'];
const renderFormItem = (item) => <span>{item.editorOptions.value}</span>;
const AddressTab = (props) => (
  <Form
    formData={props.data}
    colCount={2}
    className="address-form form-container"
  >
    {items.map((item, index) => (
      <Item
        dataField={item}
        key={index}
        render={renderFormItem}
      />
    ))}
  </Form>
);
export default AddressTab;
