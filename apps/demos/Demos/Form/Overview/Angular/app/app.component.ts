import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxCheckBoxModule, DxNumberBoxModule, DxSelectBoxModule } from 'devextreme-angular';
import { DxFormModule, DxFormTypes } from 'devextreme-angular/ui/form';
import { Company, Service } from './app.service';

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
  providers: [Service],
  templateUrl: `.${modulePrefix}/app.component.html`,
  styleUrls: [`.${modulePrefix}/app.component.css`],
})
export class AppComponent {
  companies: Company[];

  width: number;

  labelMode: DxFormTypes.FormLabelMode = 'floating';

  labelLocation: DxFormTypes.LabelLocation = 'left';

  readOnly = false;

  showColon = true;

  minColWidth = 300;

  colCount = 2;

  constructor(service: Service) {
    this.companies = service.getCompanies();
  }

  getCompanySelectorLabelMode() {
    return this.labelMode === 'outside'
      ? 'hidden'
      : this.labelMode;
  }
}

@NgModule({
  imports: [
    BrowserModule,
    DxCheckBoxModule,
    DxSelectBoxModule,
    DxNumberBoxModule,
    DxFormModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
