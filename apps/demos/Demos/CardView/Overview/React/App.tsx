import React from 'react';
import CardView, {
  CardCover, Column, Pager, Selection, SearchPanel,
} from 'devextreme-react/card-view';
import { Employee, employees } from './data.ts';

const IMG_URL = 'https://js.devexpress.com/Demos/WidgetsGallery/JSDemos';
const getEmployeeImage = ({ Picture }: Employee): string => `${IMG_URL}/${Picture}`;
const getEmployeeImageAltText = ({ FullName }: Employee): string => `${FullName} picture`;

// TODO: Nested component does not exist
const headerFilterConfig = {
  visible: true,
};

// TODO: Nested component does not exist
// TODO: Bad position types (strings not allowed)
const columnChooserConfig = {
  enabled: true,
  height: 340,
  mode: 'select' as const,
  position: {
    my: 'right top' as const,
    at: 'right bottom' as const,
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
    columnChooser={columnChooserConfig}
  >
    <Column dataField="FullName" allowHiding={false} />
    <Column dataField="Position" />
    <Column dataField="Department" />
    <Column dataField="Phone" />
    <Column dataField="Email" />

    <CardCover
      imageExpr={getEmployeeImage}
      altExpr={getEmployeeImageAltText}
    />
    <Pager showInfo={true} showNavigationButtons={true} showPageSizeSelector={true} />
    <Selection mode="multiple" />
    <SearchPanel visible={true} />
  </CardView>
);

export default App;
