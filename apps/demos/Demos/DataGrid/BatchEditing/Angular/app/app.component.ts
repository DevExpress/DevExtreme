import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, inject, signal } from '@angular/core';
import { DxDataGridModule, DxSelectBoxModule, DxCheckBoxModule } from 'devextreme-angular';
import type { DxDataGridTypes } from 'devextreme-angular/ui/data-grid';
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
    DxSelectBoxModule,
    DxCheckBoxModule,
  ],
})
export class AppComponent {
  private readonly service = inject(Service);

  readonly dataSource = this.service.getEmployees();

  readonly states = this.service.getStates();

  readonly startEditAction = signal<DxDataGridTypes.StartEditAction>('click');

  readonly selectTextOnEditStart = signal(true);
}

bootstrapApplication(AppComponent);
