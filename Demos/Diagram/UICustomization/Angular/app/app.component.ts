

import { NgModule, Component, ViewChild, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { HttpClient, HttpClientModule } from '@angular/common/http';

import { DxDiagramModule, DxDiagramComponent } from 'devextreme-angular';
import dialog from 'devextreme/ui/dialog';

if(!/localhost/.test(document.location.host)) {
    enableProdMode();
}

@Component({
    selector: 'demo-app',
    templateUrl: 'app/app.component.html',
    styleUrls: ['app/app.component.css'],
    preserveWhitespaces: true
})
export class AppComponent {
    @ViewChild(DxDiagramComponent, { static: false }) diagram: DxDiagramComponent;

    constructor(http: HttpClient) {
        http.get('../../../../data/diagram-flow.json').subscribe(data => {
            this.diagram.instance.import(JSON.stringify(data));
        }, err => {
            throw 'Data Loading Error'
        });
    }
    onCustomCommand(e) {
        if(e.name === "clear") {
            let result = dialog.confirm("Are you sure you want to clear the diagram? This action cannot be undone.", "Warning");
            result.then(
                function(dialogResult) {
                    if(dialogResult) {
                        e.component.import("");
                    }
                }
            );
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