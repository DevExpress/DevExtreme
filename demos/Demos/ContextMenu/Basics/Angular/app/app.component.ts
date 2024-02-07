import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import notify from 'devextreme/ui/notify';
import { DxContextMenuModule, DxContextMenuTypes } from 'devextreme-angular/ui/context-menu';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  templateUrl: 'app/app.component.html',
  styleUrls: ['app/app.component.css'],
})
export class AppComponent {
  items: Record<any, unknown>[];

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

  itemClick({ itemData }: DxContextMenuTypes.ItemClickEvent) {
    if (!itemData.items) {
      notify(`The "${itemData.text}" item was clicked`, 'success', 1500);
    }
  }
}

@NgModule({
  imports: [
    BrowserModule,
    BrowserTransferStateModule,
    DxContextMenuModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
