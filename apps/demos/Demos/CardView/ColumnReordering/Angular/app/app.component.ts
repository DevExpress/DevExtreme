import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { DxCardViewModule } from 'devextreme-angular';
import { Employee, Service } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  templateUrl: './app.component.html',
  providers: [Service],
})
export class AppComponent {
  employees: Employee[];
  columns: any[] = [];

  constructor(service: Service) {
    this.employees = service.getEmployees();
    this.columns = service.getColumns();
  }
  
  getImageExpr(data: Employee): string {
    return `https://js.devexpress.com/jQuery/Demos/WidgetsGallery/JSDemos/${data.Picture}`;
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
export class AppModule { }
