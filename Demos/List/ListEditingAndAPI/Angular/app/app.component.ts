import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxSelectBoxModule, DxCheckBoxModule, DxListModule } from 'devextreme-angular';

import { Service } from './app.service';

if(!/localhost/.test(document.location.host)) {
    enableProdMode();
}

@Component({
    selector: 'demo-app',
    providers: [ Service ],
    templateUrl: 'app/app.component.html',
    styleUrls: ['app/app.component.css'],
    preserveWhitespaces: true
})
export class AppComponent {
    selectedItems: any[] = [];
    allowDeleting: boolean = false;
    deleteType: string = "toggle";
    tasks: string[];

    constructor(service: Service) {
        this.tasks = service.getTasks();
    }
}

@NgModule({
    imports: [
        BrowserModule,
        DxSelectBoxModule,
        DxCheckBoxModule,
        DxListModule
    ],
    declarations: [AppComponent],
    bootstrap: [AppComponent]
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
