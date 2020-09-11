

import { NgModule, Component, ViewChild, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { HttpClient, HttpClientModule } from '@angular/common/http';

import { DxDiagramModule, DxDiagramComponent } from 'devextreme-angular';
import notify from 'devextreme/ui/notify';
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
        var dataItem = e.args.shape && e.args.shape.dataItem;
        if(e.operation === "addShape") {
            if(e.args.shape.type !== "employee" && e.args.shape.type !== "team") {
                !e.updateUI && notify("You can add only a 'Team' or 'Employee' shape.", "warning", 1000);
                e.allowed = false;
            }
        }
        else if(e.operation === "deleteShape") {
            if(dataItem && dataItem.type === "root") {
                !e.updateUI && notify("You cannot delete the 'Development' shape.", "warning", 1000);
                e.allowed = false;
            }
            if(dataItem && dataItem.type === "team") {
                var children = this.items.filter(function(item) { 
                    return item.parentId === dataItem.id;
                });
                if(children.length > 0) {
                    !e.updateUI && notify("You cannot delete a 'Team' shape connected to an 'Employee' shape.", "warning", 1000);
                    e.allowed = false;
                }
            }
        }
        else if(e.operation === "resizeShape") {
            if(e.args.newSize.width < 1 || e.args.newSize.height < 0.75) {
                !e.updateUI && notify("The shape size is too small.", "warning", 1000);
                e.allowed = false;
            }
        }
        else if(e.operation === "changeConnection") {
            if(dataItem && dataItem.type === "root" && e.args.connectorPosition === "end") {
                !e.updateUI && notify("The 'Development' shape cannot have an incoming connection.", "warning", 1000);
                e.allowed = false;
            }
            if(dataItem && dataItem.type === "team" && e.args.connectorPosition === "end") {
                if(dataItem && dataItem.parentId !== undefined && dataItem.parentId !== null) {
                    !e.updateUI && notify("A 'Team' shape can have only one incoming connection.", "warning", 1000);
                    e.allowed = false;
                }
            }
            if(dataItem && dataItem.type === "employee") {
                if(e.args.connectorPosition === "start")
                    e.allowed = false;
                if(e.args.connectorPosition === "end" && dataItem.parentId !== undefined && dataItem.parentId !== null) {
                    !e.updateUI && notify("An 'Employee' shape can have only one incoming connection.", "warning", 1000);
                    e.allowed = false;
                }                        
            }
        }
        else if(e.operation === "changeConnectorPoints") {
            if(e.args.newPoints.length > 2) {
                !e.updateUI && notify("You cannot add points to a connector.", "warning", 1000);
                e.allowed = false;
            }
        }
        else if(e.operation === "beforeChangeShapeText") {
            if(dataItem && dataItem.type === "root") {
                !e.updateUI && notify("You cannot change the 'Development' shape's text.", "warning", 1000);
                e.allowed = false;
            }
        }
        else if(e.operation === "changeShapeText") {
            if(e.args.text === "") {
                !e.updateUI && notify("A shape text cannot be empty.", "warning", 1000);
                e.allowed = false;
            }
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