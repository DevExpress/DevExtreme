import { Component, NgModule, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxSelectBoxModule,
         DxCheckBoxModule,
         DxTextBoxModule,
         DxTextAreaModule,
         DxNumberBoxModule,
         DxTagBoxModule,
         DxSwitchModule,
         DxAutocompleteModule } from 'devextreme-angular';

import { Service, Country } from './app.service';

if(!/localhost/.test(document.location.host)) {
    enableProdMode();
}

@Component({
    selector: 'demo-app',
    providers: [Service],
    templateUrl: 'app/app.component.html',
    styleUrls: ['app/app.component.css']
})

export class AppComponent {
    languages: string[] = [
      "Arabic: Right-to-Left direction",
      "English: Left-to-Right direction"
    ];
    displayExpr = "nameEn";
    rtlEnabled = false;
    textValue = "text";
    europeanUnion: Country[];
    constructor(service: Service) {
        this.europeanUnion = service.getCountries();
    }
    onLanguageChanged(data) {
        var isRTL = data.value === this.languages[0];
        this.displayExpr = isRTL ? "nameAr" : "nameEn";
        this.rtlEnabled = isRTL;
        this.textValue = isRTL ? "نص" : "text";
    }
}

@NgModule({
    imports: [
        BrowserModule,
        DxSelectBoxModule,
        DxAutocompleteModule,
        DxCheckBoxModule,
        DxSwitchModule,
        DxTextAreaModule,
        DxTextBoxModule,
        DxNumberBoxModule,
        DxTagBoxModule
    ],
    declarations: [AppComponent],
    bootstrap: [AppComponent]
})

export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);