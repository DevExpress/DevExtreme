import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxCardViewModule } from 'devextreme-angular';
import { Employee, Service } from './app.service';

if (!document.location.host.includes('localhost')) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  templateUrl: './app.component.html',
  providers: [Service],
})
export class AppComponent {
  employees: Employee[];

  columns = [
    { dataField: 'ID' },
    { dataField: 'FirstName' },
    { dataField: 'LastName' },
    { dataField: 'Prefix' },
    { dataField: 'Position' },
    { dataField: 'Picture' },
    { dataField: 'BirthDate' },
    { dataField: 'HireDate' },
    { dataField: 'Address' },
  ];

  imageExpr = (data: any) => `https://js.devexpress.com/jQuery/Demos/WidgetsGallery/JSDemos/${data.Picture}`;

  constructor(service: Service) {
    this.employees = service.getEmployees();
  }
}

@NgModule({
  imports: [
    BrowserModule,
    DxCardViewModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule {}

platformBrowserDynamic().bootstrapModule(AppModule);
