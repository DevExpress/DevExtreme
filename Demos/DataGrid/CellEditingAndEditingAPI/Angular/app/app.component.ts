import { NgModule, Component, ViewChild, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxDataGridModule,
         DxDataGridComponent,
         DxButtonModule } from 'devextreme-angular';
import { Service, Employee, State } from './app.service';
import ArrayStore from 'devextreme/data/array_store'

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
    dataSource: ArrayStore;
    states: State[];
    selectedItemKeys: any[] = [];

    constructor(service: Service) {
        this.dataSource = new ArrayStore({
            key: "ID",
            data: service.getEmployees()
        });
        this.states = service.getStates();
    }

    selectionChanged(data: any) {
        this.selectedItemKeys = data.selectedRowKeys;
    }

    deleteRecords() {
        this.selectedItemKeys.forEach((key) => {
            this.dataSource.remove(key);
        });
        this.dataGrid.instance.refresh();
    }

    onToolbarPreparing(e) {
        e.toolbarOptions.items[0].showText = 'always';

        e.toolbarOptions.items.push({
            location: "after",
            template: "deleteButton"
        });
    }
}

@NgModule({
    imports: [
        BrowserModule,
        DxDataGridModule,
        DxButtonModule
    ],
    declarations: [AppComponent],
    bootstrap: [AppComponent]
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);