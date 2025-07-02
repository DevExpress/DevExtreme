import { NgModule, Component, enableProdMode, ViewChild } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { DxCardViewModule, DxCardViewComponent, DxButtonModule } from 'devextreme-angular';
import { AppService, Employee } from './app.service';

import notify from 'devextreme/ui/notify';

if (!document.location.host.includes('localhost')) {
  enableProdMode();
}

let modulePrefix = '';
// @ts-expect-error
if (window && window.config?.packageConfigPaths) {
  modulePrefix = '/app';
}

@Component({
  selector: 'demo-app',
  templateUrl: `.${modulePrefix}/app.component.html`,
  styleUrls: [`.${modulePrefix}/app.component.css`],
})
export class AppComponent {
  @ViewChild(DxCardViewComponent, { static: true }) cardView: DxCardViewComponent;

  employees: Employee[];

  constructor(service: AppService) {
    this.employees = service.getEmployees();
  }

  imageExpr({ First_Name, Last_Name }: Employee): string {
    return `../../../../images/employees/new/${First_Name} ${Last_Name}.jpg`;
  }

  altExpr({ First_Name, Last_Name }: Employee): string {
    return `Photo of ${First_Name} ${Last_Name}`;
  }

  calculateFullName({ First_Name, Last_Name }: Employee): string {
    return `${First_Name} ${Last_Name}`;
  }

  calculateAddress({ State, City }: Employee): string {
    return `${City}, ${State}`;
  }

  showNotify(text: string) {
    notify({
      message: `The "${text}" button is clicked.`,
      maxWidth: 560,
    });
  }
}

@NgModule({
  imports: [
    BrowserModule,
    DxCardViewModule,
    DxButtonModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
  providers: [AppService],
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
