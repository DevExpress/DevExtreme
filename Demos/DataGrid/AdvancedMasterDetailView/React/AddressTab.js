import React from 'react';
import { Form, Item } from 'devextreme-react/form';

const items = ['Address', 'City', 'Region', 'PostalCode', 'Country', 'Phone'];

class AddressTab extends React.Component {

  render() {
    return (
      <Form
        formData={this.props.data}
        colCount={2}
        className="address-form form-container"
      >
        {
          items.map((item, index) =>
            <Item
              dataField={item}
              key={index}
              render={this.renderFormItem}
            />
          )
        }
      </Form>
    );
  }

  renderFormItem(item) {
    return <span>{item.editorOptions.value}</span>;
  }
}

export default AddressTab;
