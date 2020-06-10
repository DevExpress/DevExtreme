import { NgModule, ViewChild, Component, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { 
    DxButtonGroupModule,
    DxHtmlEditorModule
} from 'devextreme-angular';

import "devextreme/ui/html_editor/converters/markdown";

if(!/localhost/.test(document.location.host)) {
    enableProdMode();
}

@Component({
    selector: 'demo-app',
    templateUrl: 'app/app.component.html',
    styleUrls: ['app/app.component.css']
})

export class AppComponent {
    valueContent: string;
    editorValueType: string;

    onValueTypeChanged({ addedItems }) {
        this.editorValueType = addedItems[0].text.toLowerCase();
    }

    valueChange(value) {
        this.valueContent = value;
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