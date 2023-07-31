import React from 'react';
import DataGrid, {
  Column, RowDragging, Scrolling, Lookup, Sorting,
} from 'devextreme-react/data-grid';
import { createStore } from 'devextreme-aspnet-data-nojquery';

const url = 'https://js.devexpress.com/Demos/Mvc/api/RowReordering';

const tasksStore = createStore({
  key: 'ID',
  loadUrl: `${url}/Tasks`,
  updateUrl: `${url}/UpdateTask`,
  onBeforeSend: (method, ajaxOptions) => {
    ajaxOptions.xhrFields = { withCredentials: true };
  },
});

const employeesStore = createStore({
  key: 'ID',
  loadUrl: `${url}/Employees`,
  onBeforeSend: (method, ajaxOptions) => {
    ajaxOptions.xhrFields = { withCredentials: true };
  },
});

const processReorder = async(e) => {
  const visibleRows = e.component.getVisibleRows();
  const newOrderIndex = visibleRows[e.toIndex].data.OrderIndex;

  await tasksStore.update(e.itemData.ID, { OrderIndex: newOrderIndex });
  await e.component.refresh();
};

const onReorder = (e) => {
  e.promise = processReorder(e);
};

const App = () => (
  <DataGrid
    height={440}
    dataSource={tasksStore}
    showBorders={true}
  >
    <RowDragging
      allowReordering={true}
      onReorder={onReorder}
      dropFeedbackMode="push"
    />
    <Scrolling mode="virtual" />
    <Sorting mode="none" />
    <Column dataField="ID" width={55} />
    <Column dataField="Owner" width={150}>
      <Lookup
        dataSource={employeesStore}
        valueExpr="ID"
        displayExpr="FullName"
      />
    </Column>
    <Column
      dataField="AssignedEmployee"
      caption="Assignee"
      width={150}>
      <Lookup
        dataSource={employeesStore}
        valueExpr="ID"
        displayExpr="FullName"
      />
    </Column>
    <Column dataField="Subject" />
  </DataGrid>
);

export default App;
