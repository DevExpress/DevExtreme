import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

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

@NgModule({
  imports: [
    BrowserModule,
    DxContextMenuModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
