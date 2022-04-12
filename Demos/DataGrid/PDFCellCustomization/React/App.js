import React from 'react';
import DataGrid, {
  Column, Summary, GroupPanel, Grouping, SortByGroupSummaryInfo, TotalItem, Toolbar,
  Item,
} from 'devextreme-react/data-grid';
import Button from 'devextreme-react/button';
import { jsPDF } from 'jspdf';
import { exportDataGrid } from 'devextreme/pdf_exporter';

import { companies } from './data.js';

export default function App() {
  const dataGridRef = React.createRef();

  const exportGrid = React.useCallback(() => {
    // eslint-disable-next-line new-cap
    const doc = new jsPDF();
    const dataGrid = dataGridRef.current.instance;

    exportDataGrid({
      jsPDFDocument: doc,
      component: dataGrid,
      columnWidths: [40, 40, 30, 30, 40],
      customizeCell({ gridCell, pdfCell }) {
        if (gridCell.rowType === 'data' && gridCell.column.dataField === 'Phone') {
          pdfCell.text = pdfCell.text.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
        } else if (gridCell.rowType === 'group') {
          pdfCell.backgroundColor = '#BEDFE6';
        } else if (gridCell.rowType === 'totalFooter') {
          pdfCell.font.style = 'italic';
        }
      },
      customDrawCell(options) {
        const { gridCell, pdfCell } = options;

        if (gridCell.rowType === 'data' && gridCell.column.dataField === 'Website') {
          options.cancel = true;
          doc.setFontSize(11);
          doc.setTextColor('#0000FF');

          const textHeight = doc.getTextDimensions(pdfCell.text).h;
          doc.textWithLink('website',
            options.rect.x + pdfCell.padding.left,
            options.rect.y + options.rect.h / 2 + textHeight / 2, { url: pdfCell.text });
        }
      },
    }).then(() => {
      doc.save('Companies.pdf');
    });
  });

  function renderGridCell(data) {
    return <a href={ data.text } target='_blank' rel='noopener noreferrer'>Website</a>;
  }

  function phoneNumberFormat(value) {
    const USNumber = value.match(/(\d{3})(\d{3})(\d{4})/);
    return `(${USNumber[1]}) ${USNumber[2]}-${USNumber[3]}`;
  }

  return (
    <div>
      <DataGrid
        ref={dataGridRef}
        id="gridContainer"
        dataSource={companies}
        keyExpr="ID"
        showBorders={true}>

        <GroupPanel visible={true} />
        <Grouping autoExpandAll={true} />
        <SortByGroupSummaryInfo summaryItem="count" />

        <Column dataField="Name" width={190} />
        <Column dataField="Address" width={200} />
        <Column dataField="City" />
        <Column dataField="State" groupIndex={0} />
        <Column dataField="Phone" format={(e) => phoneNumberFormat(e)} />
        <Column dataField="Website" caption="" alignment="center" width={100} cellRender={(e) => renderGridCell(e)} />

        <Summary>
          <TotalItem
            column="Name"
            summaryType="count"
            displayFormat="Total count: {0}"
          />
        </Summary>

        <Toolbar>
          <Item name="groupPanel" />
          <Item location="after">
            <Button
              icon='exportpdf'
              text='Export to PDF'
              onClick={exportGrid}
            />
          </Item>
        </Toolbar>
      </DataGrid>
    </div>
  );
}
