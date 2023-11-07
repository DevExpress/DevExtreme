import React from 'react';
import Button from 'devextreme-react/button';
import TabPanel, { Item } from 'devextreme-react/tab-panel';
import DataGrid, { Column } from 'devextreme-react/data-grid';
import { Workbook } from 'exceljs';
import { saveAs } from 'file-saver-es';
import { exportDataGrid } from 'devextreme/excel_exporter';
import 'devextreme/data/odata/store';

const priceDataSource = {
  store: {
    type: 'odata' as const,
    version: 2,
    url: 'https://js.devexpress.com/Demos/DevAV/odata/Products',
    key: 'Product_ID',
  },
  select: ['Product_ID', 'Product_Name', 'Product_Sale_Price', 'Product_Retail_Price'],
  filter: ['Product_ID', '<', 10],
};
const ratingDataSource = {
  store: {
    type: 'odata' as const,
    version: 2,
    url: 'https://js.devexpress.com/Demos/DevAV/odata/Products',
    key: 'Product_ID',
  },
  select: ['Product_ID', 'Product_Name', 'Product_Consumer_Rating', 'Product_Category'],
  filter: ['Product_ID', '<', 10],
};

const setAlternatingRowsBackground = (gridCell, excelCell) => {
  if (gridCell.rowType === 'header' || gridCell.rowType === 'data') {
    if (excelCell.fullAddress.row % 2 === 0) {
      excelCell.fill = {
        type: 'pattern', pattern: 'solid', fgColor: { argb: 'D3D3D3' }, bgColor: { argb: 'D3D3D3' },
      };
    }
  }
};

const App = () => {
  const priceGridRef = React.useRef<DataGrid>(null);
  const ratingGridRef = React.useRef<DataGrid>(null);

  const exportGrids = React.useCallback(() => {
    const workbook = new Workbook();
    const priceSheet = workbook.addWorksheet('Price');
    const ratingSheet = workbook.addWorksheet('Rating');

    priceSheet.getRow(2).getCell(2).value = 'Price';
    priceSheet.getRow(2).getCell(2).font = { bold: true, size: 16, underline: 'double' };

    ratingSheet.getRow(2).getCell(2).value = 'Rating';
    ratingSheet.getRow(2).getCell(2).font = { bold: true, size: 16, underline: 'double' };

    exportDataGrid({
      worksheet: priceSheet,
      component: priceGridRef.current.instance,
      topLeftCell: { row: 4, column: 2 },
      customizeCell: ({ gridCell, excelCell }) => {
        setAlternatingRowsBackground(gridCell, excelCell);
      },
    }).then(() => exportDataGrid({
      worksheet: ratingSheet,
      component: ratingGridRef.current.instance,
      topLeftCell: { row: 4, column: 2 },
      customizeCell: ({ gridCell, excelCell }) => {
        setAlternatingRowsBackground(gridCell, excelCell);
      },
    })).then(() => {
      workbook.xlsx.writeBuffer().then((buffer) => {
        saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'MultipleGrids.xlsx');
      });
    });
  }, []);

  return (
    <div>
      <div id="exportContainer">
        <Button
          text="Export multiple grids"
          icon="xlsxfile"
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
