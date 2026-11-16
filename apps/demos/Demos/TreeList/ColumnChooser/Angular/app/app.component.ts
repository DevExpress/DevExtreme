import { bootstrapApplication } from '@angular/platform-browser';
import {
  Component, enableProdMode, inject, signal,
} from '@angular/core';
import { DxSelectBoxModule, DxCheckBoxModule } from 'devextreme-angular';
import { DxTextBoxTypes } from 'devextreme-angular/ui/text-box';
import { DxTreeListModule, DxTreeListTypes } from 'devextreme-angular/ui/tree-list';
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
    DxTreeListModule,
    DxSelectBoxModule,
    DxCheckBoxModule,
  ],
})
export class AppComponent {
  readonly employees = inject(Service).getEmployees();

  readonly searchEnabled = signal(true);

  readonly allowSelectAll = signal(true);

  readonly selectByClick = signal(true);

  readonly recursive = signal(true);

  readonly editorOptions: DxTextBoxTypes.Properties = { placeholder: 'Search column' };

  readonly columnChooserModes: { key: DxTreeListTypes.ColumnChooser['mode'], name: string }[] = [{
    key: 'dragAndDrop',
    name: 'Drag and drop',
  }, {
    key: 'select',
    name: 'Select',
  }];
}

bootstrapApplication(AppComponent);
