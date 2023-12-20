import React, { useCallback, useEffect, useState } from 'react';
import { SelectBox, SelectBoxTypes } from 'devextreme-react/select-box';
import { createStore } from 'devextreme-aspnet-data-nojquery';

const url = 'https://js.devexpress.com/Demos/Mvc/api/DataGridAdvancedMasterDetailView';
const productLabel = { 'aria-label': 'Product' };

interface ProductSelectBoxProps {
  supplierId: any;
  productId: any;
  onProductChanged: any;
}

const ProductSelectBox = (props: ProductSelectBoxProps) => {
  const [productsData, setProductsData] = useState(null);

  const valueChanged = useCallback((e: SelectBoxTypes.ValueChangedEvent) => {
    props.onProductChanged(e.value);
  }, [props]);

  useEffect(() => {
    const setDefaultValue = (items: any[]) => {
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
