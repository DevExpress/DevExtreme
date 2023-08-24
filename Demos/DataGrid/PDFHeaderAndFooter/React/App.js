import React from 'react';
import DataGrid, { Column, Export } from 'devextreme-react/data-grid';
import { jsPDF } from 'jspdf';
import { exportDataGrid } from 'devextreme/pdf_exporter';
import { countries } from './data.js';

const gdpFormat = {
  type: 'percent',
  precision: 1,
};

const exportFormats = ['pdf'];

const onExporting = (e) => {
  // eslint-disable-next-line new-cap
  const doc = new jsPDF();
  const lastPoint = { x: 0, y: 0 };

  exportDataGrid({
    jsPDFDocument: doc,
    component: e.component,
    topLeft: { x: 1, y: 15 },
    columnWidths: [30, 20, 30, 15, 22, 22, 20, 20],
    customDrawCell({ rect }) {
      if (lastPoint.x < rect.x + rect.w) {
        lastPoint.x = rect.x + rect.w;
      }
      if (lastPoint.y < rect.y + rect.h) {
        lastPoint.y = rect.y + rect.h;
      }
    },
  }).then(() => {
    // header
    const header = 'Country Area, Population, and GDP Structure';
    const pageWidth = doc.internal.pageSize.getWidth();
    const headerWidth = doc.getTextDimensions(header).w;

    doc.setFontSize(15);
    doc.text(header, (pageWidth - headerWidth) / 2, 20);

    // footer
    const footer = 'www.wikipedia.org';
    const footerWidth = doc.getTextDimensions(footer).w;

    doc.setFontSize(9);
    doc.setTextColor('#cccccc');
    doc.text(footer, lastPoint.x - footerWidth, lastPoint.y + 5);

    doc.save('Companies.pdf');
  });
};

const App = () => (
  <DataGrid
    dataSource={countries}
    keyExpr="ID"
    showBorders={true}
    onExporting={onExporting}
  >
    <Export enabled={true} formats={exportFormats} />
    <Column dataField="Country" />
    <Column dataField="Area" />
    <Column caption="Population">
      <Column
        dataField="Population_Total"
        caption="Total"
        format="fixedPoint"
      />
      <Column
        dataField="Population_Urban"
        caption="Urban"
        format="percent"
      />
    </Column>
    <Column caption="Nominal GDP">
      <Column
        dataField="GDP_Total"
        caption="Total, mln $"
        format="fixedPoint"
        sortOrder="desc"
      />
      <Column caption="By Sector">
        <Column
          dataField="GDP_Agriculture"
          caption="Agriculture"
          format={gdpFormat}
          width={95}
        />
        <Column
          dataField="GDP_Industry"
          caption="Industry"
          format={gdpFormat}
          width={80}
        />
        <Column
          dataField="GDP_Services"
          caption="Services"
          format={gdpFormat}
          width={85}
        />
      </Column>
    </Column>
  </DataGrid>
);

export default App;
