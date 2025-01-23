import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxNumberBoxModule, DxButtonModule } from 'devextreme-angular';
import { DxCircularGaugeModule, DxCircularGaugeTypes } from 'devextreme-angular/ui/circular-gauge';

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
  mainGenerator = 34;

  additionalGenerator = [12, 23];

  gaugeValue = 34;

  gaugeSubvalues = [12, 23];

  customizeText: DxCircularGaugeTypes.ScaleLabel['customizeText'] = ({ valueText }) => `${valueText} kV`;

  updateValues() {
    this.gaugeValue = this.mainGenerator;
    this.gaugeSubvalues = this.additionalGenerator.slice();
  }
}

@NgModule({
  imports: [
    BrowserModule,
    DxCircularGaugeModule,
    DxNumberBoxModule,
    DxButtonModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
