import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxButtonModule, DxLoadIndicatorModule, DxTemplateModule } from 'devextreme-angular';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

declare var __moduleName: string;
@Component({
  moduleId: __moduleName,
  selector: 'demo-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
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
