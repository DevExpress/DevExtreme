import { NgModule, Component, ViewChild, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxDataGridModule,
         DxDataGridComponent,
         DxTemplateModule,
         DxSelectBoxModule,
         DxButtonModule } from 'devextreme-angular';
import { Service, Order } from './app.service';

import query from 'devextreme/data/query';

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
    @ViewChild(DxDataGridComponent, { static: false }) dataGrid: DxDataGridComponent;
    orders: Order[];
    expanded = true;
    totalCount: number;
    groupingValues: any[];

    constructor(service: Service) {
        this.orders = service.getOrders();
        this.totalCount = this.getGroupCount('CustomerStoreState');

        this.groupingValues = [{
            value: 'CustomerStoreState',
            text: 'Grouping by State'
        }, {
            value: 'Employee',
            text: 'Grouping by Employee'
        }];
    }

    getGroupCount(groupField) {
        return query(this.orders)
            .groupBy(groupField)
            .toArray().length;
    }

    groupChanged(e) {
        this.dataGrid.instance.clearGrouping();
        this.dataGrid.instance.columnOption(e.value, 'groupIndex', 0);
        this.totalCount = this.getGroupCount(e.value);
    }

    collapseAllClick(e) {
        this.expanded = !this.expanded;
        e.component.option({
            text: this.expanded ? 'Collapse All' : 'Expand All'
        });
    }

    refreshDataGrid() {
        this.dataGrid.instance.refresh();
    }
}

@NgModule({
    imports: [
        BrowserModule,
        DxDataGridModule,
        DxTemplateModule,
        DxSelectBoxModule,
        DxButtonModule
    ],
    declarations: [AppComponent],
    bootstrap: [AppComponent]
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);