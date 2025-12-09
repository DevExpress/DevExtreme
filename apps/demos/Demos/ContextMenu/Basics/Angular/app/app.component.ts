import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, provideZoneChangeDetection } from '@angular/core';
import notify from 'devextreme/ui/notify';
import { DxContextMenuModule, type DxContextMenuTypes } from 'devextreme-angular/ui/context-menu';

if (!document.location.host.includes('localhost')) {
  enableProdMode();
}

let modulePrefix = '';
// @ts-ignore
if (window && window.config?.packageConfigPaths) {
  modulePrefix = '/app';
}

class ContextMenuItem {
  text: string;

  items?: ContextMenuItem[];
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
  items: ContextMenuItem[];

  constructor() {
    this.items = [{
      text: 'Share',
      items: [
        { text: 'Facebook' },
        { text: 'Twitter' }],
    },
    { text: 'Download' },
    { text: 'Comment' },
    { text: 'Favorite' },
    ];
  }

  itemClick({ itemData }: DxContextMenuTypes.ItemClickEvent<ContextMenuItem>) {
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
