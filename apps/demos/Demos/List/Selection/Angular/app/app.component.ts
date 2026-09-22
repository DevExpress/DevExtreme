import { ChangeDetectionStrategy, Component, enableProdMode, provideZoneChangeDetection } from '@angular/core';
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
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    DxSelectBoxModule,
    DxListModule,
    DxCheckBoxModule,
  ],
})
export class AppComponent {
  tasks: DataSource;

  selectAllModeValue: DxListTypes.SelectAllMode = 'page';

  selectionModeValue: SingleMultipleAllOrNone = 'all';

  selectByClick = false;

  constructor(service: Service) {
    this.tasks = new DataSource({
      store: new ArrayStore({
        key: 'id',
        data: service.getTasks(),
      }),
    });
  }
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true, runCoalescing: true }),
  ],
});
