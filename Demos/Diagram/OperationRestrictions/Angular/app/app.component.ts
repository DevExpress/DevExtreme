

import { NgModule, Component, ViewChild, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { HttpClient, HttpClientModule } from '@angular/common/http';

import { DxDiagramModule, DxDiagramComponent } from 'devextreme-angular';
import { Service } from './app.service';
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
    items: any[];
    orgItemsDataSource: ArrayStore;

    constructor(service: Service) {
        this.items = service.getOrgItems();
        this.orgItemsDataSource = new ArrayStore({
            key: "ID",
            data: this.items
        });
    }
    requestLayoutUpdateHandler(e) { 
        for(var i = 0; i < e.changes.length; i++) {
            if(e.changes[i].type === 'remove')
                e.allowed = true;
            else if(e.changes[i].data.ParentID !== undefined && e.changes[i].data.ParentID !== null)
                e.allowed = true;
        }
    } 
    requestOperationHandler(e) {
        if(e.operation === "addShape") {
            if(e.args.shape.Type !== "employee" && e.args.shape.Type !== "team") {
                e.allowed = false;
            }
        }
        else if(e.operation === "deleteShape") {
            if(e.args.shape.dataItem && e.args.shape.dataItem.Type === "root") {
                e.allowed = false;
            }
            if(e.args.shape.dataItem && e.args.shape.dataItem.Type === "team") {
                var children = this.items.filter(function(item) { 
                    return item.ParentID === e.args.shape.dataItem.ID;
                });
                if(children.length > 0)
                    e.allowed = false;
            }
        }
        else if(e.operation === "deleteConnector") {
            e.allowed = false;
        }
        else if(e.operation === "changeConnection") {
            if(e.args.connectorPosition === "end" && e.args.shape === undefined)
                e.allowed = false;
            if(e.args.shape.dataItem && e.args.shape.dataItem.Type === "root" && e.args.connectorPosition === "end")
                e.allowed = false;
            if(e.args.shape.dataItem && e.args.shape.dataItem.Type === undefined) {
                if(e.args.connectorPosition === "start")
                    e.allowed = false;
                if(e.args.connectorPosition === "end" && e.args.shape.dataItem.ParentID !== undefined && e.args.shape.dataItem.ParentID !== null)
                    e.allowed = false;
            }
        }
        else if(e.operation === "changeConnectorPoints") {
            if(e.args.newPoints.length > 2)
                e.allowed = false;
        }
        else if(e.operation === "beforeChangeShapeText") {
            if(e.args.shape.dataItem && e.args.shape.dataItem.Type === "root")
                e.allowed = false;
        }
        else if(e.operation === "changeShapeText") {
            if(e.args.text === "")
                e.allowed = false;
        }
        else if(e.operation === "beforeChangeConnectorText") {
            e.allowed = false;
        }
    }
}

@NgModule({
    imports: [
        BrowserModule,
        HttpClientModule,
        DxDiagramModule
    ],
    declarations: [AppComponent],
    bootstrap: [AppComponent]
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);