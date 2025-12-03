import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, provideZoneChangeDetection } from '@angular/core';
import notify from 'devextreme/ui/notify'; // Import notify correctly
import { DxContextMenuModule, type DxContextMenuTypes } from 'devextreme-angular/ui/context-menu';

import { Service, type ContextMenuItems } from './app.service';

if (!document.location.host.includes('localhost')) {
  enableProdMode();
}

let modulePrefix = '';
// @ts-ignore
if (window && window.config?.packageConfigPaths) {
  modulePrefix = '/app';
}

@Component({
  selector: 'demo-app',
  providers: [Service],
  templateUrl: `.${modulePrefix}/app.component.html`,
  styleUrls: [`.${modulePrefix}/app.component.css`],
  imports: [
    DxContextMenuModule,
  ],
})
export class AppComponent {
  items: ContextMenuItems[];

  constructor(service: Service) {
    this.items = service.getMenuItems();
  }

  itemClick({ itemData }: DxContextMenuTypes.ItemClickEvent<ContextMenuItems>) {
    if (!itemData.items) {
      notify(`The "${itemData.text}" item was clicked`, 'success', 1500);
    }
  }
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true, runCoalescing: true }),
  ],
});
