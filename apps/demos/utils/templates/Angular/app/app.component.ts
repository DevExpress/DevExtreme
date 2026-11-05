import { Component, enableProdMode, inject } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { DxDataGridModule } from 'devextreme-angular';
import { Service } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  templateUrl: './app.component.html',
  providers: [Service],
  imports: [DxDataGridModule]
})
export class AppComponent {
  readonly customers = inject(Service).getCustomers();

  constructor() {
  }
}


bootstrapApplication(AppComponent);
