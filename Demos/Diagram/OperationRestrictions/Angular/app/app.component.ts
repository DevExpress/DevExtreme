

import { NgModule, Component, ViewChild, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { HttpClient, HttpClientModule } from '@angular/common/http';

import { DxDiagramModule, DxDiagramComponent } from 'devextreme-angular';
import notify from 'devextreme/ui/notify';
import { Service } from './app.service';
import ArrayStore from 'devextreme/data/array_store'
import dxDiagram, { dxDiagramConnector } from 'devextreme/ui/diagram';

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
    @ViewChild(DxDiagramComponent, { static: false }) diagram: DxDiagramComponent;
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
    isParent(shapeToTest, shape) {
        if(shapeToTest.id === shape.id) return true;

        var diagram = this.diagram.instance;
        for(var i = 0; i < shapeToTest.attachedConnectorIds.length; i++) {
            var connector = diagram.getItemById(shapeToTest.attachedConnectorIds[i]) as dxDiagramConnector;
            if(connector.fromId === shapeToTest.id && connector.toId) {
                var childShape = diagram.getItemById(connector.toId);
                if(childShape.id === shape.id || this.isParent(childShape, shape))
                    return true;
            }
        }
        return false;
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
        var diagram = this.diagram.instance;
        if(e.operation === "addShape") {
            if(e.args.shape.type !== "employee" && e.args.shape.type !== "team") {
                if(e.reason !== "checkUIElementAvailability")
                    this.showToast("You can add only a 'Team' or 'Employee' shape.");
                e.allowed = false;
            }
        }
        else if(e.operation === "deleteShape") {
            if(e.args.shape.type === "root") {
                if(e.reason !== "checkUIElementAvailability")
                    this.showToast("You cannot delete the 'Development' shape.");
                e.allowed = false;
            }
            if(e.args.shape.type === "team") {
                for(var i = 0; i < e.args.shape.attachedConnectorIds.length; i++) {
                    if(diagram.getItemById(e.args.shape.attachedConnectorIds[i]).toId != e.args.shape.id) {
                        if(e.reason !== "checkUIElementAvailability")
                            this.showToast("You cannot delete a 'Team' shape that has a child shape.");
                        e.allowed = false;
                        break;
                    }
                }
            }
        }
        else if(e.operation === "resizeShape") {
            if(e.args.newSize.width < 1 || e.args.newSize.height < 0.75) {
                if(e.reason !== "checkUIElementAvailability")
                    this.showToast("The shape size is too small.");
                e.allowed = false;
            }
        }
        else if(e.operation === "changeConnection") {
            var shapeType = e.args.newShape && e.args.newShape.type;
            if(shapeType === "root" && e.args.connectorPosition === "end") {
                if(e.reason !== "checkUIElementAvailability")
                    this.showToast("The 'Development' shape cannot have an incoming connection.");
                e.allowed = false;
            }
            if(shapeType === "team") {
                if(e.args.connectorPosition === "end" && e.args.newShape.attachedConnectorIds.length > 1) {
                    for(var i = 0; i < e.args.newShape.attachedConnectorIds.length; i++) {
                        if(e.args.connector && e.args.newShape.attachedConnectorIds[i] != e.args.connector.id) {
                            var connector = diagram.getItemById(e.args.newShape.attachedConnectorIds[i]) as dxDiagramConnector;
                            if(connector.toId === e.args.newShape.id) {
                                if(e.reason !== "checkUIElementAvailability")
                                    this.showToast("A 'Team' shape can have only one incoming connection.");
                                e.allowed = false;
                                break;
                            }
                        }
                    }
                }
                if(e.allowed && e.args.connector && e.args.connector.fromId && e.args.connector.toId) {
                    var shapeFrom = diagram.getItemById(e.args.connector.fromId);
                    var shapeTo = diagram.getItemById(e.args.connector.toId);
                    if(this.isParent(shapeTo, shapeFrom)) {
                        if(e.reason !== "checkUIElementAvailability")
                            this.showToast("A circular reference is not allowed.");
                        e.allowed = false;
                    }
                }
            }
            if(shapeType === "employee") {
                if(e.args.connectorPosition === "start")
                    e.allowed = false;
                
                if(e.args.connectorPosition === "end" && e.args.newShape.attachedConnectorIds.length > 1) {
                    if(e.reason !== "checkUIElementAvailability")
                        this.showToast("An 'Employee' shape can have only one incoming connection.");
                    e.allowed = false;
                }                        
            }
        }
        else if(e.operation === "changeConnectorPoints") {
            if(e.args.newPoints.length > 2) {
                if(e.reason !== "checkUIElementAvailability")
                    this.showToast("You cannot add points to a connector.");
                e.allowed = false;
            }
        }
        else if(e.operation === "beforeChangeShapeText") {
            if(e.args.shape.type === "root") {
                if(e.reason !== "checkUIElementAvailability")
                    this.showToast("You cannot change the 'Development' shape's text.");
                e.allowed = false;
            }
        }
        else if(e.operation === "changeShapeText") {
            if(e.args.text === "") {
                if(e.reason !== "checkUIElementAvailability")
                    this.showToast("A shape text cannot be empty.");
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