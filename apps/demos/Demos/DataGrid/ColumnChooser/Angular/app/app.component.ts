import { bootstrapApplication } from '@angular/platform-browser';
import {
  Component, enableProdMode, inject, signal,
} from '@angular/core';
import { DxDataGridModule, DxSelectBoxModule, DxCheckBoxModule } from 'devextreme-angular';
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
    DxCheckBoxModule,
  ],
})
export class AppComponent {
  readonly employees = inject(Service).getEmployees();

  readonly searchEnabled = signal(true);

  readonly editorOptions = { placeholder: 'Search column' };

  readonly allowSelectAll = signal(true);

  readonly selectByClick = signal(true);

  readonly recursive = signal(true);

  readonly columnChooserModes = [{
    key: 'dragAndDrop',
    name: 'Drag and drop',
  }, {
    key: 'select',
    name: 'Select',
  }];
}

bootstrapApplication(AppComponent);
