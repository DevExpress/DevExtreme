import React from 'react';
import { CardView,
   CardCover, Column, Pager, SearchPanel, Selection,
} from 'devextreme-react/card-view';
import { employees } from './data.js';

const IMG_URL = 'https://js.devexpress.com/Demos/WidgetsGallery/JSDemos';
const getEmployeeImage = ({ Picture }) => `${IMG_URL}/${Picture}`;
const getEmployeeImageAltText = ({ FullName }) => `${FullName} picture`;

// TODO: Nested component does not exist
const headerFilterConfig = {
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
    allowColumnReordering={true}
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

    <CardCover
      imageExpr={getEmployeeImage}
      altExpr={getEmployeeImageAltText}
    />
    <Pager
      showInfo={true}
      showNavigationButtons={true}
      showPageSizeSelector={true}
    />
    <SearchPanel visible={true} />
    <Selection mode="multiple" />
  </CardView>
);
export default App;
