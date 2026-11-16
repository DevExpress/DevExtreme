import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, inject, signal } from '@angular/core';
import { DxSelectBoxModule, DxCheckBoxModule } from 'devextreme-angular';
import { DxListModule } from 'devextreme-angular/ui/list';
import type { DxListTypes } from 'devextreme-angular/ui/list';
import { Service } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  providers: [Service],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  preserveWhitespaces: true,
  imports: [
    DxSelectBoxModule,
    DxCheckBoxModule,
    DxListModule,
  ],
})
export class AppComponent {
  readonly allowDeletion = signal(false);

  readonly itemDeleteMode = signal<DxListTypes.ItemDeleteMode>('toggle');

  readonly tasks = inject(Service).getTasks();
}

bootstrapApplication(AppComponent);
