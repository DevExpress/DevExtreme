import React, { useCallback, useState } from 'react';
import { Form, Item, Label } from 'devextreme-react/form';

import ProductSelectBox from './ProductSelectBox.tsx';
import OrderHistory from './OrderHistory.tsx';

interface OrdersTabProps {
  supplierId: any;
}

const OrdersTab = (props: OrdersTabProps) => {
  const [chosenProductId, setChosenProductId] = useState(null);

  const renderSelectBox = useCallback(() => (
    <ProductSelectBox
      supplierId={props.supplierId}
      productId={chosenProductId}
      onProductChanged={setChosenProductId} />
  ), [chosenProductId, props.supplierId]);

  const renderOrderHistory = useCallback(() => (
    <OrderHistory productId={chosenProductId} />
  ), [chosenProductId]);

  return (
    <Form
      labelLocation="top"
      className="form-container"
    >
      <Item render={renderSelectBox}>
        <Label text="Product" />
      </Item>
      <Item render={renderOrderHistory}>
        <Label text="Order History" />
      </Item>
    </Form>
  );
};

export default OrdersTab;
