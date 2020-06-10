import React from 'react';
import DataGrid from 'devextreme-react/data-grid';

import { createStore } from 'devextreme-aspnet-data-nojquery';

const url = 'https://js.devexpress.com/Demos/Mvc/api/DataGridWebApi';

class MasterDetailGrid extends React.Component {
  constructor(props) {
    super(props);
    this.dataSource = getMasterDetailGridDataSource(props.data.key);
  }
  render() {
    return (
      <DataGrid
        dataSource={this.dataSource}
        showBorders={true}
      />
    );
  }
}

function getMasterDetailGridDataSource(id) {
  return {
    store: createStore({
      loadUrl: `${url}/OrderDetails`,
      loadParams: { orderID: id },
      onBeforeSend: (method, ajaxOptions) => {
        ajaxOptions.xhrFields = { withCredentials: true };
      }
    })
  };
}

export default MasterDetailGrid;
