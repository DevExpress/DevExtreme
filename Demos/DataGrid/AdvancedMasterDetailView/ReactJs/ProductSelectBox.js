import React from 'react';
import { SelectBox } from 'devextreme-react/select-box';
import { createStore } from 'devextreme-aspnet-data-nojquery';

const url = 'https://js.devexpress.com/Demos/Mvc/api/DataGridAdvancedMasterDetailView';
const productLabel = { 'aria-label': 'Product' };
const ProductSelectBox = (props) => {
  const [productsData, setProductsData] = React.useState(null);
  const valueChanged = React.useCallback(
    (e) => {
      props.onProductChanged(e.value);
    },
    [props],
  );
  React.useEffect(() => {
    const setDefaultValue = (items) => {
      const firstItem = items[0];
      if (firstItem && props.productId === null) {
        props.onProductChanged(firstItem.ProductID);
      }
    };
    const newProductsData = createStore({
      key: 'ProductID',
      loadParams: { SupplierID: props.supplierId },
      loadUrl: `${url}/GetProductsBySupplier`,
      onLoaded: setDefaultValue,
    });
    setProductsData(newProductsData);
  }, [props]);
  return (
    <SelectBox
      value={props.productId}
      deferRendering={false}
      inputAttr={productLabel}
      dataSource={productsData}
      valueExpr="ProductID"
      displayExpr="ProductName"
      onValueChanged={valueChanged}
    />
  );
};
export default ProductSelectBox;
