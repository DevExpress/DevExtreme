import {
  NgModule, Component, ViewChild, enableProdMode,
} from '@angular/core';
import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxListModule, DxRadioGroupModule, DxToolbarModule } from 'devextreme-angular';
import { DxDrawerModule, DxDrawerComponent, DxDrawerTypes } from 'devextreme-angular/ui/drawer';
import { List, Service } from './app.service';

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
  @ViewChild(DxDrawerComponent, { static: false }) drawer: DxDrawerComponent;

  navigation: List[];

  text: string;

  showSubmenuModes: DxDrawerTypes.RevealMode[] = ['slide', 'expand'];

  positionModes: DxDrawerTypes.PanelLocation[] = ['left', 'right'];

  showModes: DxDrawerTypes.OpenedStateMode[] = ['push', 'shrink', 'overlap'];

  selectedOpenMode: DxDrawerTypes.OpenedStateMode = 'shrink';

  selectedPosition: DxDrawerTypes.PanelLocation = 'left';

  selectedRevealMode: DxDrawerTypes.RevealMode = 'slide';

  isDrawerOpen = true;

  constructor(service: Service) {
    this.text = service.getContent();
    this.navigation = service.getNavigationList();
  }

  toolbarContent = [{
    widget: 'dxButton',
    location: 'before',
    options: {
      icon: 'menu',
      stylingMode: 'text',
      onClick: () => this.isDrawerOpen = !this.isDrawerOpen,
    },
  }];
}

@NgModule({
  imports: [
    BrowserModule,
    BrowserTransferStateModule,
    DxDrawerModule,
    DxListModule,
    DxRadioGroupModule,
    DxToolbarModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
