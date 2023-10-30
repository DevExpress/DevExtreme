import React from 'react';
import Button from 'devextreme-react/button';
import TabPanel, { Item } from 'devextreme-react/tab-panel';
import DataGrid, { Column } from 'devextreme-react/data-grid';
import { exportDataGrid } from 'devextreme/pdf_exporter';
import { jsPDF } from 'jspdf';

import 'devextreme/data/odata/store';

const priceDataSource = {
  store: {
    type: 'odata',
    version: 2,
    url: 'https://js.devexpress.com/Demos/DevAV/odata/Products',
    key: 'Product_ID',
  },
  select: ['Product_ID', 'Product_Name', 'Product_Sale_Price', 'Product_Retail_Price'],
  filter: ['Product_ID', '<', 10],
};
const ratingDataSource = {
  store: {
    type: 'odata',
    version: 2,
    url: 'https://js.devexpress.com/Demos/DevAV/odata/Products',
    key: 'Product_ID',
  },
  select: ['Product_ID', 'Product_Name', 'Product_Consumer_Rating', 'Product_Category'],
  filter: ['Product_ID', '<', 10],
};

const setAlternatingRowsBackground = (dataGrid, gridCell, pdfCell) => {
  if (gridCell.rowType === 'data') {
    const rowIndex = dataGrid.getRowIndexByKey(gridCell.data.Product_ID);
    if (rowIndex % 2 === 0) {
      pdfCell.backgroundColor = '#D3D3D3';
    }
  }
};

const App = () => {
  const priceGridRef = React.useRef(null);
  const ratingGridRef = React.useRef(null);

  const exportGrids = React.useCallback(() => {
    // eslint-disable-next-line new-cap
    const doc = new jsPDF();

    exportDataGrid({
      jsPDFDocument: doc,
      component: priceGridRef.current.instance,
      topLeft: { x: 7, y: 5 },
      columnWidths: [20, 50, 50, 50],
      customizeCell: ({ gridCell, pdfCell }) => {
        setAlternatingRowsBackground(priceGridRef.current.instance, gridCell, pdfCell);
      },
    }).then(() => {
      doc.addPage();
      exportDataGrid({
        jsPDFDocument: doc,
        component: ratingGridRef.current.instance,
        topLeft: { x: 7, y: 5 },
        columnWidths: [20, 50, 50, 50],
        customizeCell: ({ gridCell, pdfCell }) => {
          setAlternatingRowsBackground(ratingGridRef.current.instance, gridCell, pdfCell);
        },
      }).then(() => {
        doc.save('MultipleGrids.pdf');
      });
    });
  }, []);

  return (
    <div>
      <div id="exportContainer">
        <Button
          text="Export multiple grids"
          icon="exportpdf"
          onClick={exportGrids}
        />
      </div>
      <TabPanel id="tabPanel" deferRendering={false}>
        <Item title="Price">
          <DataGrid
            id="priceDataGrid"
            ref={priceGridRef}
            dataSource={priceDataSource}
            showBorders={true}
            rowAlternationEnabled={true}
          >
            <Column dataField="Product_ID" caption="ID" width={50} />
            <Column dataField="Product_Name" caption="Name" />
            <Column dataField="Product_Sale_Price" caption="Sale Price" dataType="number" format="currency" />
            <Column dataField="Product_Retail_Price" caption="Retail Price" dataType="number" format="currency" />
          </DataGrid>
        </Item>
        <Item title="Rating">
          <DataGrid
            id="ratingDataGrid"
            ref={ratingGridRef}
            dataSource={ratingDataSource}
            showBorders={true}
            rowAlternationEnabled={true}
          >
            <Column dataField="Product_ID" caption="ID" width={50} />
            <Column dataField="Product_Name" caption="Name" />
            <Column dataField="Product_Consumer_Rating" caption="Rating" />
            <Column dataField="Product_Category" caption="Category" />
          </DataGrid>
        </Item>
      </TabPanel>
    </div>
  );
};

export default App;
