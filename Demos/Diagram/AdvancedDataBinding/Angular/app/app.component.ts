

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
    orgItemsDataSource: ArrayStore;
    orgLinksDataSource: ArrayStore;

    constructor(service: Service) {
        this.orgItemsDataSource = new ArrayStore({
            key: "ID",
            data: service.getOrgItems()
        });
        this.orgLinksDataSource = new ArrayStore({
            key: "ID",
            data: service.getOrgLinks()
        });
    }
    itemTypeExpr(obj, value) {
        if(value)
            obj.Type = (value === "rectangle") ? undefined : "group";
        else
            return obj.Type === "group" ? "ellipse" : "rectangle";
    }
    itemWidthExpr(obj, value) {
        if(value)
            obj.Width = value;
        else
            return obj.Width || (obj.Type === "group" && 1.5) || 1;
    }
    itemHeightExpr(obj, value) {
        if(value)
            obj.Height = value;
        else
            return obj.Height || (obj.Type === "group" && 1) || 0.75;
    }
    itemTextStyleExpr(obj) {
        if(obj.Level === "senior")
            return { "font-weight": "bold", "text-decoration": "underline" };
        return {};
    }
    itemStyleExpr(obj) {
        let style = { "stroke": "#444444" };
        if(obj.Type === "group")
            style["fill"] = "#f3f3f3";
        return style;
    }
    linkStyleExpr(obj) {
        return { "stroke": "#444444" };
    }
    linkFromLineEndExpr(obj) {
        return "none";
    }
    linkToLineEndExpr(obj) {
        return "none";
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