import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, inject, signal } from '@angular/core';
import { DxDataGridModule, DxSelectBoxModule } from 'devextreme-angular';
import themes from 'devextreme/ui/themes';
import { Service } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [Service],
  preserveWhitespaces: true,
  imports: [
    DxDataGridModule,
    DxSelectBoxModule,
  ],
})
export class AppComponent {
  readonly sales = inject(Service).getSales();

  readonly allMode = signal<string>('allPages');

  readonly checkBoxesMode = signal<string>(themes.current().startsWith('generic') ? 'onClick' : 'always');
}

bootstrapApplication(AppComponent);
