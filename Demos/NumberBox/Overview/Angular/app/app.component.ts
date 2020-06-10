import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxNumberBoxModule } from 'devextreme-angular';

if(!/localhost/.test(document.location.host)) {
    enableProdMode();
}

@Component({
    selector: 'demo-app',
    templateUrl: 'app/app.component.html'
})
export class AppComponent {
    keyDown(e) {
        const event = e.event;
        const str = event.key || String.fromCharCode(event.which);
        if(/^[.,e]$/.test(str)) {
            event.preventDefault();
        }
    }
}

@NgModule({
    imports: [
        BrowserModule,
        DxNumberBoxModule
    ],
    declarations: [AppComponent],
    bootstrap: [AppComponent]
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);