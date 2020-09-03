

import { NgModule, Component, Pipe, PipeTransform, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { HttpClient, HttpClientModule } from '@angular/common/http';

import { DxDiagramModule, DxDiagramComponent } from 'devextreme-angular';
import { Service, Employee } from './app.service';
import ArrayStore from 'devextreme/data/array_store'

if(!/localhost/.test(document.location.host)) {
    enableProdMode();
}

@Component({
    selector: 'demo-app',
    templateUrl: 'app/app.component.html',
    styleUrls: ['app/app.component.css'],
    providers: [Service],
    preserveWhitespaces: true
})
export class AppComponent {
    dataSource: ArrayStore;
    selectedItems: any[];

    constructor(service: Service) {
        this.dataSource = new ArrayStore({
            key: "this",
            data: service.getEmployees()
        });
    }

    selectionChangedHandler(args) {
        this.selectedItems = args.items.filter(item => item.itemType === "shape");
    }    
}

@Pipe({ name: 'stringifyItems' })
export class StringifyItemsPipe implements PipeTransform {
    transform(items: any[]) {
        return items
            .map(function(item) { return item.text; })
            .join(", ");
    }
}

@NgModule({
    imports: [
        BrowserModule,
        HttpClientModule,
        DxDiagramModule
    ],
    declarations: [AppComponent, StringifyItemsPipe],
    bootstrap: [AppComponent]
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);