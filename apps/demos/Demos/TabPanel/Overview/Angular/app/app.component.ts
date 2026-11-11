import { bootstrapApplication } from '@angular/platform-browser';
import {
  Component, enableProdMode, inject, signal,
} from '@angular/core';
import {
  DxTabPanelModule, DxCheckBoxModule, DxSelectBoxModule,
} from 'devextreme-angular';
import type { DxTabPanelTypes } from 'devextreme-angular/ui/tab-panel';
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
    DxTabPanelModule,
    DxCheckBoxModule,
    DxSelectBoxModule,
  ],
})

export class AppComponent {
  readonly dataSource = inject(Service).getItems();

  readonly tabsPositions: DxTabPanelTypes.Position[] = [
    'left', 'top', 'right', 'bottom',
  ];

  readonly tabsPosition = signal<DxTabPanelTypes.Position>(this.tabsPositions[0]);

  readonly stylingModes: DxTabPanelTypes.TabsStyle[] = ['secondary', 'primary'];

  readonly stylingMode = signal<DxTabPanelTypes.TabsStyle>(this.stylingModes[0]);

  readonly iconPositions: DxTabPanelTypes.TabsIconPosition[] = [
    'top', 'start', 'end', 'bottom',
  ];

  readonly iconPosition = signal<DxTabPanelTypes.TabsIconPosition>(this.iconPositions[0]);

  getTaskItemClasses(priority: string) {
    return `task-item task-item-priority-${priority}`;
  }
}

bootstrapApplication(AppComponent);
