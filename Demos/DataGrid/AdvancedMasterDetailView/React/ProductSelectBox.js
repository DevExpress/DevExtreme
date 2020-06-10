import React from 'react';
import { SelectBox } from 'devextreme-react/select-box';
import { createStore } from 'devextreme-aspnet-data-nojquery';

const url = 'https://js.devexpress.com/Demos/Mvc/api/DataGridAdvancedMasterDetailView';

class ProductSelectBox extends React.Component {

  constructor(props) {
    super(props);

    this.productsData = createStore({
      key: 'ProductID',
      loadParams: { SupplierID: this.props.supplierId },
      loadUrl: `${url}/GetProductsBySupplier`,
      onLoaded: this.setDefaultValue.bind(this)
    });

    this.valueChanged = this.valueChanged.bind(this);
  }

  render() {
    return (
      <SelectBox
        value={this.props.productId}
        deferRendering={false}
        dataSource={this.productsData}
        valueExpr="ProductID"
        displayExpr="ProductName"
        onValueChanged={this.valueChanged}
      />
    );
  }

  setDefaultValue(items) {
    let firstItem = items[0];
    if(firstItem && this.props.productId === null) {
      this.props.onProductChanged(firstItem.ProductID);
    }
  }

  valueChanged(e) {
    this.props.onProductChanged(e.value);
  }
}

export default ProductSelectBox;
