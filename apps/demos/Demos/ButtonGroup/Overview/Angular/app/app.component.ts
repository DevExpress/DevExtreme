import { Component, NgModule, enableProdMode } from '@angular/core';
import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxButtonGroupModule } from 'devextreme-angular';
import notify from 'devextreme/ui/notify';

import { Alignment, FontStyle, Service } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  providers: [Service],
  templateUrl: 'app/app.component.html',
  styleUrls: ['app/app.component.css'],
  preserveWhitespaces: true,
})

export class AppComponent {
  alignments: Alignment[];

  fontStyles: FontStyle[];

  constructor(service: Service) {
    this.alignments = service.getAlignments();
    this.fontStyles = service.getFontStyles();
  }

  itemClick(e) {
    notify({ message: `The "${e.itemData.hint}" button was clicked`, width: 320 }, 'success', 1000);
  }
}

@NgModule({
  imports: [
    BrowserModule,
    BrowserTransferStateModule,
    DxButtonGroupModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})

export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
