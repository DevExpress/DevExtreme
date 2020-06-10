import React from 'react';
import { TabPanel, Item } from 'devextreme-react/tab-panel';

import AddressTab from './AddressTab.js';
import OrdersTab from './OrdersTab.js';

class MasterDetailView extends React.Component {

  constructor(props) {
    super(props);
    this.renderOrdersTab = this.renderOrdersTab.bind(this);
    this.renderAddressTab = this.renderAddressTab.bind(this);
  }

  render() {
    return (
      <TabPanel>
        <Item title="Orders" render={this.renderOrdersTab} />
        <Item title="Address" render={this.renderAddressTab} />
      </TabPanel>
    );
  }

  renderOrdersTab() {
    return <OrdersTab supplierId={this.props.data.key} />;
  }

  renderAddressTab() {
    return <AddressTab data={this.props.data.data} />;
  }
}

export default MasterDetailView;
