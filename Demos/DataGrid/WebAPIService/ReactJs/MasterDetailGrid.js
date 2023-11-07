import React from 'react';
import DataGrid from 'devextreme-react/data-grid';
import { createStore } from 'devextreme-aspnet-data-nojquery';

const url = 'https://js.devexpress.com/Demos/Mvc/api/DataGridWebApi';
const getMasterDetailGridDataSource = (id) => ({
  store: createStore({
    loadUrl: `${url}/OrderDetails`,
    loadParams: { orderID: id },
    onBeforeSend: (method, ajaxOptions) => {
      ajaxOptions.xhrFields = { withCredentials: true };
    },
  }),
});
const MasterDetailGrid = (props) => {
  const [dataSource, setDataSource] = React.useState(null);
  React.useEffect(() => {
    const masterDetailDataSource = getMasterDetailGridDataSource(props.data.key);
    setDataSource(masterDetailDataSource);
  }, [props.data.key]);
  return (
    <DataGrid
      dataSource={dataSource}
      showBorders={true}
    />
  );
};
export default MasterDetailGrid;
