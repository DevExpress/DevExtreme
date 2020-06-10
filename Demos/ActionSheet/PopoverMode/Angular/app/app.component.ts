import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { DxActionSheetModule, DxListModule } from 'devextreme-angular';
import { Contact, Service } from './app.service';
import notify from 'devextreme/ui/notify';

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
    contacts: Contact[];
    commands: any[] = [ 
        { text: 'Call' },
        { text: 'Send message' },
        { text: 'Edit' },
        { text: 'Delete' }
    ];
    actionSheetVisible = false;
    actionSheetTarget: any = "";

    constructor(service: Service) {
        this.contacts = service.getContacts();
    }
    itemClick(e) {
        this.actionSheetTarget = e.itemElement;
        this.actionSheetVisible = true;
    }
    showNotify(value) {
        notify('The "' + value + '" button is clicked.');
    }
}

@NgModule({
    imports: [
        BrowserModule,
        DxActionSheetModule,
        DxListModule
    ],
    declarations: [AppComponent],
    bootstrap: [AppComponent]
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);