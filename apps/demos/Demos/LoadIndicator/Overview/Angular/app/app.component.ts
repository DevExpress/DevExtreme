import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxButtonModule, DxLoadIndicatorModule, DxTemplateModule } from 'devextreme-angular';

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
  styleUrls: [`.${modulePrefix}/app.component.css`],
})
export class AppComponent {
  loadIndicatorVisible = false;

  buttonText = 'Send';

  onClick(data) {
    this.buttonText = 'Sending';
    this.loadIndicatorVisible = true;

    setTimeout(() => {
      this.buttonText = 'Send';
      this.loadIndicatorVisible = false;
    }, 2000);
  }
}

@NgModule({
  imports: [
    BrowserModule,
    DxButtonModule,
    DxLoadIndicatorModule,
    DxTemplateModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
