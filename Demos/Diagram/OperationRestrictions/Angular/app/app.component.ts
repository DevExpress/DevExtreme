

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
    showToast(text) {
        notify({ 
            position: { at: "top", my: "top", of: "#diagram", offset: "0 4" }, 
            message: text, 
            type: "warning", 
            delayTime: 2000
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
    requestEditOperationHandler(e) {
        var dataItem;
        if(e.operation === "addShape") {
            if(e.args.shape.type !== "employee" && e.args.shape.type !== "team") {
                !e.updateUI && this.showToast("You can add only a 'Team' or 'Employee' shape.");
                e.allowed = false;
            }
        }
        else if(e.operation === "deleteShape") {
            dataItem = e.args.shape && e.args.shape.dataItem;
            if(dataItem && dataItem.Type === "root") {
                !e.updateUI && this.showToast("You cannot delete the 'Development' shape.");
                e.allowed = false;
            }
            if(dataItem && dataItem.Type === "team") {
                var children = this.items.filter(function(item) { 
                    return item.ParentID === dataItem.ID;
                });
                if(children.length > 0) {
                    !e.updateUI && this.showToast("You cannot delete a 'Team' shape that has a child shape.");
                    e.allowed = false;
                }
            }
        }
        else if(e.operation === "resizeShape") {
            if(e.args.newSize.width < 1 || e.args.newSize.height < 0.75) {
                !e.updateUI && this.showToast("The shape size is too small.");
                e.allowed = false;
            }
        }
        else if(e.operation === "changeConnection") {
            dataItem = e.args.newShape && e.args.newShape.dataItem;
            if(dataItem && dataItem.Type === "root" && e.args.connectorPosition === "end") {
                !e.updateUI && this.showToast("The 'Development' shape cannot have an incoming connection.");
                e.allowed = false;
            }
            if(dataItem && dataItem.Type === "team" && e.args.connectorPosition === "end") {
                if(dataItem && dataItem.ParentID !== undefined && dataItem.ParentID !== null) {
                    !e.updateUI && this.showToast("A 'Team' shape can have only one incoming connection.");
                    e.allowed = false;
                }
            }
            if(dataItem && dataItem.Type === "employee") {
                if(e.args.connectorPosition === "start")
                    e.allowed = false;
                if(e.args.connectorPosition === "end" && dataItem.ParentID !== undefined && dataItem.ParentID !== null) {
                    !e.updateUI && this.showToast("An 'Employee' shape can have only one incoming connection.");
                    e.allowed = false;
                }                        
            }
        }
        else if(e.operation === "changeConnectorPoints") {
            if(e.args.newPoints.length > 2) {
                !e.updateUI && this.showToast("You cannot add points to a connector.");
                e.allowed = false;
            }
        }
        else if(e.operation === "beforeChangeShapeText") {
            dataItem = e.args.shape && e.args.shape.dataItem;
            if(dataItem && dataItem.Type === "root") {
                !e.updateUI && this.showToast("You cannot change the 'Development' shape's text.");
                e.allowed = false;
            }
        }
        else if(e.operation === "changeShapeText") {
            if(e.args.text === "") {
                !e.updateUI && this.showToast("A shape text cannot be empty.");
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