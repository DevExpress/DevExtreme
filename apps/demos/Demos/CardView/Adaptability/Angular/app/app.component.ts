import { NgModule, Component, enableProdMode } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";
import { DxCardViewModule, DxSelectBoxModule } from "devextreme-angular";
import { Employee, Service } from "./app.service";

if (!document.location.host.includes("localhost")) {
  enableProdMode();
}

@Component({
  selector: "demo-app",
  templateUrl: "./app.component.html",
  providers: [Service],
})
export class AppComponent {
  employees: Employee[];
  cardsPerRow = 3;

  calculateFullName(data: any): string {
    return `${data.FirstName} ${data.LastName}`;
  }

  imageExpr = (data: Employee) => `https://js.devexpress.com/jQuery/Demos/WidgetsGallery/JSDemos/${data.Picture}`;

  constructor(service: Service) {
    this.employees = service.getEmployees();
  }

  updateCardsPerRow(event: any) {
    this.cardsPerRow = event.value;
  }
}

@NgModule({
  imports: [BrowserModule, DxCardViewModule, DxSelectBoxModule],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule {}

platformBrowserDynamic().bootstrapModule(AppModule);
