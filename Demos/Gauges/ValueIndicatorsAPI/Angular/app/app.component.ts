import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxCircularGaugeModule, DxNumberBoxModule, DxButtonModule } from 'devextreme-angular';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  templateUrl: 'app/app.component.html',
  styleUrls: ['app/app.component.css'],
})
export class AppComponent {
  mainGenerator = 34;

  additionalGenerator: number[] = [12, 23];

  gaugeValue = 34;

  gaugeSubvalues: number[] = [12, 23];

  customizeText(arg: any) {
    return `${arg.valueText} kV`;
  }

  updateValues() {
    this.gaugeValue = this.mainGenerator;
    this.gaugeSubvalues = this.additionalGenerator.slice();
  }
}

@NgModule({
  imports: [
    BrowserModule,
    BrowserTransferStateModule,
    DxCircularGaugeModule,
    DxNumberBoxModule,
    DxButtonModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
