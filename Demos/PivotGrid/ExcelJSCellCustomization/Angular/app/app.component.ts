import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxPivotGridModule } from 'devextreme-angular';
import { Service, Sale } from './app.service';
import { exportPivotGrid } from 'devextreme/excel_exporter';
import ExcelJS from 'exceljs';
import saveAs from 'file-saver';
/*
// Use this import for codeSandBox
import * as ExcelJS from 'exceljs/dist/exceljs.min.js';
import * as FileSaver from 'file-saver';
*/

if(!/localhost/.test(document.location.host)) {
    enableProdMode();
}

@Component({
    selector: 'demo-app',
    templateUrl: 'app/app.component.html',
    providers: [Service]
})
export class AppComponent {
    sales: Sale[];
    dataSource: any;

    constructor(service: Service) {
        this.dataSource = {
            fields: [{
                caption: 'Region',
                dataField: 'region',
                area: 'row',
                expanded: true
            }, {
                caption: 'City',
                dataField: 'city',
                width: 150,
                area: 'row'
            }, {
                dataField: 'date',
                dataType: 'date',
                area: 'column'
            }, {
                caption: 'Sales',
                dataField: 'amount',
                dataType: 'number',
                summaryType: 'sum',
                format: 'currency',
                area: 'data'
            }],
            store: service.getSales()
        }
    }

    onExporting(e) {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Sales');

        exportPivotGrid({
            component: e.component,
            worksheet: worksheet,
            customizeCell: ({ pivotCell, excelCell }) => {
                if(this.isDataCell(pivotCell) || this.isTotalCell(pivotCell)) {
                    const appearance = this.getConditionalAppearance(pivotCell);
                    Object.assign(excelCell, this.getExcelCellFormat(appearance));
                }

                const borderStyle = { style: 'thin', color: { argb: 'FF7E7E7E' } };
                excelCell.border = {
                    bottom: borderStyle,
                    left: borderStyle,
                    right: borderStyle,
                    top: borderStyle
                };
            }
        }).then(() => {
            workbook.xlsx.writeBuffer().then((buffer) => {
                saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'Sales.xlsx');
            });
        });
        e.cancel = true;
    }

    onCellPrepared({ cell, area, cellElement }) {
        cell.area = area;
        if(this.isDataCell(cell) || this.isTotalCell(cell)) {
            const appearance = this.getConditionalAppearance(cell);
            Object.assign(cellElement.style, this.getCssStyles(appearance));
        }
    }

    isDataCell(cell) {
        return (cell.area === 'data' && cell.rowType === 'D' && cell.columnType === 'D');
    }

    isTotalCell(cell) {
        return (cell.type === 'T' || cell.type === 'GT' || cell.rowType === 'T' || cell.rowType === 'GT' || cell.columnType === 'T' || cell.columnType === 'GT');
    }

    getExcelCellFormat({ fill, font, bold }) {
        return {
            fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: fill } },
            font: { color: { argb: font }, bold }
        };
    }

    getCssStyles({ fill, font, bold }) {
        return {
            'background-color': `#${fill}`,
            color: `#${font}`,
            'font-weight': bold ? 'bold' : undefined
        };
    }

    getConditionalAppearance(cell) {
        if(this.isTotalCell(cell)) {
            return { fill: 'F2F2F2', font: '3F3F3F', bold: true };
        } else {
            const { value } = cell;
            if(value < 20000) {
                return { font: '9C0006', fill: 'FFC7CE' };
            }
            if(value > 50000) {
                return { font: '006100', fill: 'C6EFCE' };
            }
            return { font: '9C6500', fill: 'FFEB9C' };
        }
    }
}

@NgModule({
    imports: [
        BrowserModule,
        DxPivotGridModule
    ],
    declarations: [AppComponent],
    bootstrap: [AppComponent]
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);