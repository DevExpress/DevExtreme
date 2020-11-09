import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxDataGridModule } from 'devextreme-angular';
import { Service, Order } from './app.service';
import { exportDataGrid } from 'devextreme/excel_exporter';
import ExcelJS from 'exceljs';
import saveAs from 'file-saver';
/*
    // Use this import for codeSandBox
    import * as ExcelJS from "exceljs/dist/exceljs.min.js";
    import * as FileSaver from "file-saver";
*/

if(!/localhost/.test(document.location.host)) {
    enableProdMode();
}

@Component({
    selector: 'demo-app',
    templateUrl: 'app/app.component.html',
    styleUrls: ['app/app.component.css'],
    providers: [Service]
})

export class AppComponent {
    orders: Order[];

    constructor(private service: Service) {
        this.orders = service.getOrders();
    }

    onCellPrepared(e) {
        if(e.rowType === 'data') {
            if(e.data.OrderDate < new Date(2014, 2, 3)) {
              e.cellElement.style.color = '#AAAAAA';
            }
            if(e.data.SaleAmount > 15000) {
              if(e.column.dataField === 'OrderNumber') {
                e.cellElement.style.fontWeight = 'bold';
              }
              if(e.column.dataField === 'SaleAmount') {
                e.cellElement.style.backgroundColor = '#FFBB00';
                e.cellElement.style.color = '#000000';
              }
            }
        }
        if(e.rowType === 'group') {
            const nodeColors = [ '#BEDFE6', '#C9ECD7'];
            e.cellElement.style.backgroundColor = nodeColors[e.row.groupIndex];
            e.cellElement.style.color = '#000';
            if(e.cellElement.firstChild && e.cellElement.firstChild.style) e.cellElement.firstChild.style.color = '#000';
        }
        if(e.rowType === 'groupFooter') {
            e.cellElement.style.fontStyle = 'italic';
        }       
    }

    onExporting(e) {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Main sheet');

        /*
          The 'DevExpress.excelExporter.exportDataGrid' function uses the ExcelJS library.
          For more information about ExcelJS, see:
            - https://github.com/exceljs/exceljs#contents
            - https://github.com/exceljs/exceljs#browser
        */

        exportDataGrid({
            component: e.component,
            worksheet: worksheet,
            topLeftCell: { row: 4, column: 1 },
            customizeCell: options => {

                /*
                  The 'options.excelCell' field contains an ExcelJS object that describes an Excel cell.
                  Refer to the following topics for more details about its members:
                    - value and type - https://github.com/exceljs/exceljs#value-types
                    - alignment - https://github.com/exceljs/exceljs#alignment
                    - border - https://github.com/exceljs/exceljs#borders
                    - fill - https://github.com/exceljs/exceljs#fills
                    - font - https://github.com/exceljs/exceljs#fonts
                    - numFmt - https://github.com/exceljs/exceljs#number-formats
                  The 'options.gridCell' object fields are described in https://js.devexpress.com/Documentation/ApiReference/Common/Object_Structures/ExcelDataGridCell/
                */

                const { gridCell, excelCell } = options;

                if(gridCell.rowType === 'data') {
                    if(gridCell.data.OrderDate < new Date(2014, 2, 3)) {
                        excelCell.font = { color: { argb: 'AAAAAA' } };
                    }
                    if(gridCell.data.SaleAmount > 15000) {
                        if(gridCell.column.dataField === 'SaleAmount') {
                            Object.assign(excelCell, {
                                font: { color: { argb: '000000' } }, 
                                fill: { type: 'pattern', pattern:'solid', fgColor: { argb:'FFBB00' } }
                            });
                        }
                    }
                    if(gridCell.column.dataField === "CustomerStoreState") {
                        Object.assign(excelCell, {
                          value: { text: gridCell.value, hyperlink: "http://example.com" },
                          font: { color: { argb: 'FF0000FF'}, underline: true }
                        });
                    }
                }
                if(gridCell.rowType === 'group') {
                    const nodeColors = [ 'BEDFE6', 'C9ECD7'];
                    Object.assign(excelCell, {
                        fill: { type: 'pattern', pattern:'solid', fgColor: { argb: nodeColors[gridCell.groupIndex] } }
                    });
                }
                if(gridCell.rowType === 'groupFooter' && excelCell.value) {
                    Object.assign(excelCell.font, { italic: true });
                }
            }
        }).then(function(cellRange) {
            // header
            worksheet.getRow(2).height = 20;
            worksheet.mergeCells(2, 1, 2, 4);
            Object.assign(worksheet.getRow(2).getCell(1), {
                value: "Sales amounts report",
                font: { bold: true, size: 16 },
                alignment: { horizontal: 'center' }
            });
            // footer
            const currentRowIndex = cellRange.to.row + 2;
            worksheet.mergeCells(currentRowIndex, 1, currentRowIndex, 4);
            worksheet.getRow(currentRowIndex).getCell(1).value = "For demonstration purposes only";
            Object.assign(worksheet.getRow(currentRowIndex).getCell(1), {
                font: { italic: true },
                alignment: { horizontal: 'right' }
            });
        }).then(function() {
            workbook.xlsx.writeBuffer().then(function(buffer) {
                saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'DataGrid.xlsx');
            });
        });
        e.cancel = true;
    }
}

@NgModule({
    imports: [
        BrowserModule,
        DxDataGridModule
    ],
    declarations: [AppComponent],
    bootstrap: [AppComponent]
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);