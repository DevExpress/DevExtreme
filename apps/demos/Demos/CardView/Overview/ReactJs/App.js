import React from 'react';
import CardView, {
  CardCover,
  Column,
  Pager,
  Selection,
  ColumnChooser,
  Position,
  ColumnChooserSelection,
  SearchPanel,
} from 'devextreme-react/card-view';
import { employees } from './data.js';

const IMG_URL = 'https://js.devexpress.com/Demos/WidgetsGallery/JSDemos';
const getEmployeeImage = ({ Picture }) => `${IMG_URL}/${Picture}`;
const getEmployeeImageAltText = ({ FullName }) => `${FullName} picture`;
// TODO: Nested component does not exist
const headerFilterConfig = {
  visible: true,
};
const App = () => (
  <CardView
    dataSource={employees}
    keyExpr="ID"
    allowColumnReordering={true}
    cardsPerRow="auto"
    cardMinWidth={250}
    headerFilter={headerFilterConfig}
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
    <Selection mode="multiple" />
    <ColumnChooser
      enabled={true}
      height="340px"
      mode="select"
    >
      <Position
        my="right top"
        at="right bottom"
        of=".dx-cardview-column-chooser-button"
      />
      <ColumnChooserSelection selectByClick={true} />
    </ColumnChooser>
    <SearchPanel visible={true} />
  </CardView>
);
export default App;
