import { NgModule, ViewChild, Component, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { 
    DxButtonGroupModule,
    DxHtmlEditorModule
} from 'devextreme-angular';

import "devextreme/ui/html_editor/converters/markdown";

import { Service } from './app.service';

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
    valueContent: string;
    editorValueType: string;

    constructor(service: Service) {
        this.valueContent = service.getMarkup();
    }

    onValueTypeChanged({ addedItems }) {
        this.editorValueType = addedItems[0].text.toLowerCase();
    }
}

@NgModule({
    imports: [
        BrowserModule,
        DxHtmlEditorModule,
        DxButtonGroupModule
    ],
    declarations: [AppComponent],
    bootstrap: [AppComponent]
})

export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);