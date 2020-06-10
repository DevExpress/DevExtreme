import { Component, NgModule, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxTextAreaModule, DxCheckBoxModule, DxSelectBoxModule } from 'devextreme-angular';

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
    valueChangeEvents: any[];
    eventValue: string;
    maxLength = null;
    value: string;
    valueForEditableTextArea: string;
    constructor(private service: Service) {
        this.valueForEditableTextArea = this.service.getContent();
        this.value = this.service.getContent();
        this.valueChangeEvents = [{
                title: 'On Blur',
                name: 'change'
            }, {
                title: 'On Key Up',
                name: 'keyup'
        }];
        this.eventValue = this.valueChangeEvents[0].name;    
    }
    onCheckboxValueChanged(e) {
        if (e.value) {
            this.value = this.service.getContent().substring(0, 100);
            this.maxLength = 100;
        } else {
            this.value = this.service.getContent();
            this.maxLength = null;
        }
    }
}

@NgModule({
    imports: [
        BrowserModule,
        DxTextAreaModule,
        DxCheckBoxModule,
        DxSelectBoxModule
    ],
    declarations: [AppComponent],
    bootstrap: [AppComponent]
})

export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);