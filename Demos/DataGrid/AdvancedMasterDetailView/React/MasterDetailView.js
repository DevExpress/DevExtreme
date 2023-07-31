import React from 'react';
import { TabPanel, Item } from 'devextreme-react/tab-panel';

import AddressTab from './AddressTab.js';
import OrdersTab from './OrdersTab.js';

const MasterDetailView = (props) => {
  const renderOrdersTab = React.useCallback(() => (
    <OrdersTab supplierId={props.data.key} />
  ), [props.data.key]);

  const renderAddressTab = React.useCallback(() => (
    <AddressTab data={props.data.data} />
  ), [props.data.data]);

  return (
    <TabPanel>
      <Item title="Orders" render={renderOrdersTab} />
      <Item title="Address" render={renderAddressTab} />
    </TabPanel>
  );
};

export default MasterDetailView;
