import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxFormModule } from 'devextreme-angular';
import { DxCheckBoxModule, DxCheckBoxTypes } from 'devextreme-angular/ui/check-box';
import { Employee, Service } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  providers: [Service],
  templateUrl: 'app/app.component.html',
  styleUrls: ['app/app.component.css'],
})
export class AppComponent {
  employee: Employee;

  colCountByScreen = {
    md: 4,
    sm: 2,
  };

  constructor(service: Service) {
    this.employee = service.getEmployee();
  }

  screen = (width: number) => (width < 720 ? 'sm' : 'md');

  valueChanged(e: DxCheckBoxTypes.ValueChangedEvent) {
    if (e.value) {
      this.colCountByScreen = null;
    } else {
      this.colCountByScreen = {
        md: 4,
        sm: 2,
      };
    }
  }
}

@NgModule({
  imports: [
    BrowserModule,
    BrowserTransferStateModule,
    DxCheckBoxModule,
    DxFormModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
