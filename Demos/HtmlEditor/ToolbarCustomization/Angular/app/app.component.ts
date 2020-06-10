import { NgModule, ViewChild, Component, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import {
    DxHtmlEditorComponent,
    DxHtmlEditorModule,
    DxPopupComponent,
    DxPopupModule
} from 'devextreme-angular';

if(!/localhost/.test(document.location.host)) {
    enableProdMode();
}

@Component({
    selector: 'demo-app',
    templateUrl: 'app/app.component.html',
    styleUrls: ['app/app.component.css']
})

export class AppComponent {
    editorValue: string;
    popupVisible: boolean;

    toolbarButtonOptions :any = {
        text: 'Show markup',
        stylingMode: 'text',
        onClick: () => this.popupVisible = true
    };
}

@NgModule({
    imports: [
        BrowserModule,
        DxHtmlEditorModule,
        DxPopupModule
    ],
    declarations: [AppComponent],
    bootstrap: [AppComponent]
})

export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);