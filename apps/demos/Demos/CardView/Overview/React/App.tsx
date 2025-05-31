import React from 'react';
import CardView, {
  CardCover, Column, Pager, Selection,
  HeaderFilter,
  ColumnChooser, Position, ColumnChooserSelection,
  SearchPanel,
} from 'devextreme-react/card-view';
import { Employee, employees } from './data.ts';

const IMG_URL = 'https://js.devexpress.com/Demos/WidgetsGallery/JSDemos';
const getEmployeeImage = ({ Picture }: Employee): string => `${IMG_URL}/${Picture}`;
const getEmployeeImageAltText = ({ FullName }: Employee): string => `${FullName} picture`;

const App = () => (
  <CardView
    dataSource={employees}
    keyExpr="ID"
    allowColumnReordering={true}
    cardsPerRow="auto"
    cardMinWidth={250}
  >
    <Column dataField="FullName" allowHiding={false} />
    <Column dataField="Position" />
    <Column dataField="Department" />
    <Column dataField="Phone" />
    <Column dataField="Email" />

    <HeaderFilter visible={true} />

    <CardCover
      imageExpr={getEmployeeImage}
      altExpr={getEmployeeImageAltText}
    />
    <Pager showInfo={true} showNavigationButtons={true} showPageSizeSelector={true} />
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
