import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { DxFileManagerModule } from 'devextreme-angular';

import { Service, FileItem } from './app.service';

if(!/localhost/.test(document.location.host)) {
    enableProdMode();
}

@Component({
    selector: 'demo-app',
    templateUrl: 'app/app.component.html',
    providers: [Service],
    preserveWhitespaces: true
})

export class AppComponent {
    fileItems: FileItem[];

    constructor(service: Service) {
        this.fileItems = service.getFileItems();
    }
}

@NgModule({
    imports: [
        BrowserModule,
        DxFileManagerModule
    ],
    declarations: [AppComponent],
    bootstrap: [AppComponent]
})

export class AppModule { }
platformBrowserDynamic().bootstrapModule(AppModule);
