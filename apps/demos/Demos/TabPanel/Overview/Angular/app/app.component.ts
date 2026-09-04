import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, provideZoneChangeDetection } from '@angular/core';
import {
  DxTabPanelModule, DxCheckBoxModule, DxSelectBoxModule,
} from 'devextreme-angular';
import type { DxTabPanelTypes } from 'devextreme-angular/ui/tab-panel';
import { TabPanelItem, Service } from './app.service';

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
  dataSource: TabPanelItem[];

  tabsPositions: DxTabPanelTypes.Position[] = [
    'left', 'top', 'right', 'bottom',
  ];

  tabsPosition: DxTabPanelTypes.Position = this.tabsPositions[0];

  stylingModes: DxTabPanelTypes.TabsStyle[] = ['secondary', 'primary'];

  stylingMode: DxTabPanelTypes.TabsStyle = this.stylingModes[0];

  iconPositions: DxTabPanelTypes.TabsIconPosition[] = [
    'top', 'start', 'end', 'bottom',
  ];

  iconPosition: DxTabPanelTypes.TabsIconPosition = this.iconPositions[0];

  constructor(service: Service) {
    this.dataSource = service.getItems();
  }

  getTaskItemClasses(priority: string) {
    return `task-item task-item-priority-${priority}`;
  }
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true, runCoalescing: true }),
  ],
});
