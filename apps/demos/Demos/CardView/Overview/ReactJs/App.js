import React from 'react';
import CardView, {
  CardCover, Column, Pager, Selection,
} from 'devextreme-react/card-view';
import { employees } from './data.js';

const IMG_URL = 'https://js.devexpress.com/jQuery/Demos/WidgetsGallery/JSDemos';
const getEmployeeImage = ({ Picture }) => `${IMG_URL}/${Picture}`;
// TODO: Nested component does not exist
const headerFilterConfig = {
  visible: true,
};
// TODO: Nested component does not exist
const searchPanelConfig = {
  visible: true,
};
// TODO: Nested component does not exist
// TODO: Bad position types (strings not allowed)
const columnChooserConfig = {
  enabled: true,
  height: 340,
  mode: 'select',
  position: {
    my: 'right top',
    at: 'right bottom',
    of: '.dx-cardview-column-chooser-button',
  },
  selection: {
    selectByClick: true,
  },
};
const App = () => (
  <CardView
    dataSource={employees}
    keyExpr="ID"
    cardsPerRow="auto"
    cardMinWidth={250}
    headerFilter={headerFilterConfig}
    searchPanel={searchPanelConfig}
    columnChooser={columnChooserConfig}
  >
    <Column
      dataField="FullName"
      allowHiding={false}
    />
    <Column dataField="Position" />
    <Column dataField="Department" />
    <Column dataField="Phone" />
    <Column dataField="Email" />

    <CardCover imageExpr={getEmployeeImage} />
    <Pager
      showInfo={true}
      showNavigationButtons={true}
      showPageSizeSelector={true}
    />
    <Selection mode="multiple" />
  </CardView>
);
export default App;
