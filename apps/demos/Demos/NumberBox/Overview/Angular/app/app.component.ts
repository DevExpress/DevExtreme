import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxNumberBoxModule, DxNumberBoxTypes } from 'devextreme-angular/ui/number-box';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

let modulePrefix = '';
// @ts-ignore
if (window && window.config?.packageConfigPaths) {
  modulePrefix = '/app';
}

@Component({
  selector: 'demo-app',
  templateUrl: `.${modulePrefix}/app.component.html`,
})
export class AppComponent {
  keyDown(e: DxNumberBoxTypes.KeyDownEvent) {
    const event = e.event;
    const str = event.key;
    if (/^[.,e]$/.test(str)) {
      event.preventDefault();
    }
  }
}

@NgModule({
  imports: [
    BrowserModule,
    DxNumberBoxModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
