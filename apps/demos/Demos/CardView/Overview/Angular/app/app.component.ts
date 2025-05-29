import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { DxCardViewModule } from 'devextreme-angular';
import { AppService, Employee } from './app.service';

if (!document.location.host.includes('localhost')) {
  enableProdMode();
}

let modulePrefix = '';
// @ts-expect-error
if (window && window.config?.packageConfigPaths) {
  modulePrefix = '/app';
}

const IMG_URL = 'https://js.devexpress.com/Demos/WidgetsGallery/JSDemos';

@Component({
  selector: 'demo-app',
  templateUrl: `.${modulePrefix}/app.component.html`,
  styleUrls: [`.${modulePrefix}/app.component.css`],
})
export class AppComponent {
  employees: Employee[];

  // TODO: Nested component does not exist
  headerFilterConfig = {
    visible: true,
  };

  constructor(service: AppService) {
    this.employees = service.getEmployees();
  }

  getEmployeeImage({ Picture }: Employee): string {
    return `${IMG_URL}/${Picture}`;
  }

  getEmployeeImageAltText({ FullName }: Employee): string {
    return `${FullName} picture`;
  }
}

@NgModule({
  imports: [
    BrowserModule,
    DxCardViewModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
  providers: [AppService],
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
