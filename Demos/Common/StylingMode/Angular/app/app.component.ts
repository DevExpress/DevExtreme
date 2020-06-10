import { Component, NgModule, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import {
    DxSelectBoxModule,
    DxTextBoxModule,
    DxTextAreaModule,
    DxTagBoxModule,
    DxDateBoxModule,
    DxButtonModule,
    DxValidatorModule
} from 'devextreme-angular';
import notify from 'devextreme/ui/notify';
import validationEngine from 'devextreme/ui/validation_engine';

if (!/localhost/.test(document.location.host)) {
    enableProdMode();
}

@Component({
    selector: 'demo-app',
    providers: [],
    templateUrl: 'app/app.component.html',
    styleUrls: ['app/app.component.css'],
    preserveWhitespaces: true
})

export class AppComponent {
    stylingMode = "filled";
    date = new Date(2020, 4, 3);
    validateClick(e) {
        var result = e.validationGroup.validate();
        if (result.isValid) {
            notify('The task was saved successfully.', 'success');
        } else {
            notify('The task was not saved. Please check if all fields are valid.', 'error');
        }
    }
    constructor() {
        setTimeout(() => validationEngine.validateGroup());
    }
}

@NgModule({
    imports: [
        BrowserModule,
        DxSelectBoxModule,
        DxTextBoxModule,
        DxTextAreaModule,
        DxTagBoxModule,
        DxDateBoxModule,
        DxButtonModule,
        DxValidatorModule
    ],
    declarations: [AppComponent],
    bootstrap: [AppComponent]
})

export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
