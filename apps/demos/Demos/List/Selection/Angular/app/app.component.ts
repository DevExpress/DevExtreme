import {
  Component, enableProdMode, inject, signal,
} from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { DataSource, ArrayStore } from 'devextreme-angular/common/data';
import { DxSelectBoxModule, DxCheckBoxModule } from 'devextreme-angular';
import type { SingleMultipleAllOrNone } from 'devextreme-angular/common';
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
    DxListModule,
    DxCheckBoxModule,
  ],
})
export class AppComponent {
  readonly tasks = new DataSource({
    store: new ArrayStore({
      key: 'id',
      data: inject(Service).getTasks(),
    }),
  });

  readonly selectAllModeValue = signal<DxListTypes.SelectAllMode>('page');

  readonly selectionModeValue = signal<SingleMultipleAllOrNone>('all');

  readonly selectByClick = signal(false);

  readonly selectedItemKeys = signal<number[]>([]);
}

bootstrapApplication(AppComponent);
