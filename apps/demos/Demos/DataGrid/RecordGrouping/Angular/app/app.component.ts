import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, inject, signal } from '@angular/core';
import { DxDataGridModule, DxCheckBoxModule } from 'devextreme-angular';
import { Service } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [Service],
  imports: [
    DxDataGridModule,
    DxCheckBoxModule,
  ],
})
export class AppComponent {
  readonly customers = inject(Service).getCustomers();

  readonly autoExpandAll = signal(true);
}

bootstrapApplication(AppComponent);
