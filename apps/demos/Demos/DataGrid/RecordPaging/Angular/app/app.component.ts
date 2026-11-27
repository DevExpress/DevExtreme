import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, computed, inject, signal } from '@angular/core';
import { DxDataGridModule, DxCheckBoxModule, DxSelectBoxModule } from 'devextreme-angular';
import type { DxDataGridTypes } from 'devextreme-angular/ui/data-grid';
import type { DisplayMode } from 'devextreme-angular/common';
import type { PagerPageSize } from 'devextreme-angular/common/grids';
import { Service } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  templateUrl: './app.component.html',
  providers: [Service],
  styleUrls: ['./app.component.css'],
  imports: [
    DxDataGridModule,
    DxCheckBoxModule,
    DxSelectBoxModule,
  ],
})
export class AppComponent {
  readonly dataSource = inject(Service).generateData(100000);

  readonly allowedPageSizes: (number | PagerPageSize)[] = [5, 10, 'all'];

  readonly displayModes = [{ text: "Display Mode 'full'", value: 'full' }, { text: "Display Mode 'compact'", value: 'compact' }];

  readonly displayMode = signal<DisplayMode>('full');

  readonly showPageSizeSelector = signal(true);

  readonly showInfo = signal(true);

  readonly showNavButtons = signal(true);

  customizeColumns(columns: DxDataGridTypes.Column[]) {
    columns[0].width = 70;
  }

  readonly isCompactMode = computed(() => this.displayMode() === 'compact');
}

bootstrapApplication(AppComponent);
