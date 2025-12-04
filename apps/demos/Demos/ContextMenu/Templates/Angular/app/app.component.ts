import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, provideZoneChangeDetection } from '@angular/core';
import notify from 'devextreme/ui/notify';
import { DxContextMenuModule, type DxContextMenuTypes } from 'devextreme-angular/ui/context-menu';

if (!document.location.host.includes('localhost')) {
  enableProdMode();
}

class ContextMenuItem {
  text: string;

  icon?: string;

  items?: ContextMenuItem[];
}

let modulePrefix = '';
// @ts-ignore
if (window && window.config?.packageConfigPaths) {
  modulePrefix = '/app';
}

@Component({
  selector: 'demo-app',
  templateUrl: `.${modulePrefix}/app.component.html`,
  styleUrls: [`.${modulePrefix}/app.component.css`],
  imports: [
    DxContextMenuModule,
  ],
})
export class AppComponent {
  dataSource: ContextMenuItem[] = [{
    text: 'Share',
    icon: 'dx-icon-globe',
    items: [
      { text: 'Facebook' },
      { text: 'Twitter' }],
  },
  { text: 'Download', icon: 'dx-icon-download' },
  { text: 'Add Comment', icon: 'dx-icon-add' },
  { text: 'Add to Favorite', icon: 'dx-icon-favorites' },
  ];

  itemClick({ itemData: { items, text } }: DxContextMenuTypes.ItemClickEvent<ContextMenuItem>) {
    if (!items) {
      notify(`The "${text}" item was clicked`, 'success', 1500);
    }
  }
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true, runCoalescing: true }),
  ],
});
