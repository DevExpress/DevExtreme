import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import notify from 'devextreme/ui/notify';
import { DxContextMenuModule, DxContextMenuTypes } from 'devextreme-angular/ui/context-menu';

if (!document.location.host.includes('localhost')) {
  enableProdMode();
}

declare var __moduleName: string;
@Component({
  moduleId: __moduleName,
  selector: 'demo-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  dataSource = [{
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

  itemClick({ itemData: { items, text } }: DxContextMenuTypes.ItemClickEvent) {
    if (!items) {
      notify(`The "${text}" item was clicked`, 'success', 1500);
    }
  }
}

@NgModule({
  imports: [
    BrowserModule, DxContextMenuModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
