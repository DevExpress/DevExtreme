import React, { useCallback } from 'react';
import { TabPanel, Item } from 'devextreme-react/tab-panel';
import { DataGridTypes } from 'devextreme-react/data-grid';

import AddressTab from './AddressTab.tsx';
import OrdersTab from './OrdersTab.tsx';

const MasterDetailView = (props: DataGridTypes.MasterDetailTemplateData) => {
  const renderOrdersTab = useCallback(() => (
    <OrdersTab supplierId={props.data.key} />
  ), [props.data.key]);

  const renderAddressTab = useCallback(() => (
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
