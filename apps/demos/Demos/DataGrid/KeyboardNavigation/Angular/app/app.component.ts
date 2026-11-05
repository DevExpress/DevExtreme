import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, inject } from '@angular/core';
import { DxDataGridModule } from 'devextreme-angular';
import { Service } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  templateUrl: './app.component.html',
  providers: [Service],
  imports: [
    DxDataGridModule,
  ],
})
export class AppComponent {
  private readonly service = inject(Service);

  readonly employees = this.service.getEmployees();

  readonly states = this.service.getStates();
}

bootstrapApplication(AppComponent);
