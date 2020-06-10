import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxTreeViewModule } from 'devextreme-angular';
import DataSource from 'devextreme/data/data_source';
import ODataStore from 'devextreme/data/odata/store';

if(!/localhost/.test(document.location.host)) {
    enableProdMode();
}

@Component({
    selector: 'demo-app',
    templateUrl: 'app/app.component.html'
})
export class AppComponent {
    dataSource: any;
    constructor() {
        this.dataSource = new DataSource({
            store: new ODataStore({
                url: 'https://js.devexpress.com/Demos/WidgetsGallery/odata/HierarchicalItems'
            })
        });
    }
}

@NgModule({
    imports: [
        BrowserModule,
        DxTreeViewModule
    ],
    declarations: [AppComponent],
    bootstrap: [AppComponent]
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);