import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxDataGridModule } from 'devextreme-angular';
import { Service, Order } from './app.service';

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
            if(e.row.groupIndex === 0) {
                e.cellElement.style.backgroundColor = '#BEDFE6';
            }
            if(e.row.groupIndex === 1) {
                e.cellElement.style.backgroundColor = '#C9ECD7';
            }
            e.cellElement.style.color = '#000';
            if(e.cellElement.firstChild && e.cellElement.firstChild.style) e.cellElement.firstChild.style.color = '#000';
        }

        if(e.rowType === 'groupFooter' && e.column.dataField === 'SaleAmount') {
            e.cellElement.style.fontStyle = 'italic';
        }         
    }
    
    customizeExcelCell(options) {
        var gridCell = options.gridCell;
        if(!gridCell) {
            return;
        }

        if(gridCell.rowType === 'data') {
            if(gridCell.data.OrderDate < new Date(2014, 2, 3)) {
                options.font.color = '#AAAAAA';
            }
            if(gridCell.data.SaleAmount > 15000) {
                if(gridCell.column.dataField === 'OrderNumber') {
                    options.font.bold = true;
                }
                if(gridCell.column.dataField === 'SaleAmount') {
                    options.backgroundColor = '#FFBB00';
                    options.font.color = '#000000';
                }
            }
        }

        if(gridCell.rowType === 'group') {
            if(gridCell.groupIndex === 0) {
                options.backgroundColor = '#BEDFE6';
            }
            if(gridCell.groupIndex === 1) {
                options.backgroundColor = '#C9ECD7';
            }
            if(gridCell.column.dataField === 'Employee') {
                options.value = `${gridCell.value} (${gridCell.groupSummaryItems[0].value} items)`;
                options.font.bold = false;
            }
            if(gridCell.column.dataField === 'SaleAmount') {
                options.value = gridCell.groupSummaryItems[0].value;
                options.numberFormat = '&quot;Max: &quot;$0.00';
            }
        }

        if(gridCell.rowType === 'groupFooter' && gridCell.column.dataField === 'SaleAmount') {
            options.value = gridCell.value;
            options.numberFormat = "&quot;Sum: &quot;$0.00";
            options.font.italic = true;
        }

        if(gridCell.rowType === 'totalFooter' && gridCell.column.dataField === 'SaleAmount') {
            options.value = gridCell.value;
            options.numberFormat = "&quot;Total Sum: &quot;$0.00";
        }
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