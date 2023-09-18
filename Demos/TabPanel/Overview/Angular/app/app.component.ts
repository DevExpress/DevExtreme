import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import {
  DxTabPanelModule, DxCheckBoxModule, DxSelectBoxModule, DxTemplateModule,
} from 'devextreme-angular';

import { TabPanelItem, Service } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  templateUrl: 'app/app.component.html',
  styleUrls: ['app/app.component.css'],
  providers: [Service],
  preserveWhitespaces: true,
})

export class AppComponent {
  dataSource: TabPanelItem[];

  tabsPositions: string[] = [
    'left',
    'top',
    'right',
    'bottom',
  ];

  tabsPosition: string = this.tabsPositions[0];

  stylingModes: string[] = [
    'secondary',
    'primary',
  ];

  stylingMode: string = this.stylingModes[0];

  iconPositions: string[] = [
    'top',
    'start',
    'end',
    'bottom',
  ];

  iconPosition: string = this.iconPositions[0];

  selectedIndex = 0;

  showNavButtons = true;

  constructor(service: Service) {
    this.dataSource = service.getItems();
  }

  getTaskClassName(priority: string) {
    return `task-item task-item-priority-${priority}`;
  }
}

@NgModule({
  imports: [
    BrowserModule,
    BrowserTransferStateModule,
    DxTabPanelModule,
    DxCheckBoxModule,
    DxSelectBoxModule,
    DxTemplateModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
