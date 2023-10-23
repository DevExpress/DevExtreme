import {
  NgModule, Component, enableProdMode, ViewChild,
} from '@angular/core';
import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import {
  DxTabsModule, DxSelectBoxModule, DxCheckBoxModule, DxTabsComponent,
} from 'devextreme-angular';

import { Tab, Service } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  templateUrl: 'app/app.component.html',
  styleUrls: ['app/app.component.css'],
  providers: [Service],
})
export class AppComponent {
  @ViewChild('withText') withText: DxTabsComponent;

  @ViewChild('withIconAndText') withIconAndText: DxTabsComponent;

  @ViewChild('withIcon') withIcon: DxTabsComponent;

  tabsWithText: Tab[];

  tabsWithIconAndText: Tab[];

  tabsWithIcon: Tab[];

  orientations: string[] = ['horizontal', 'vertical'];

  stylingModes: string[] = ['primary', 'secondary'];

  iconPositions: string[] = ['top', 'start', 'end', 'bottom'];

  orientation: string;

  stylingMode: string;

  iconPosition: string;

  showNavButtons = false;

  scrollByContent = false;

  widgetWrapperClasses = 'widget-wrapper widget-wrapper-horizontal';

  constructor(service: Service) {
    this.tabsWithText = service.getTabsWithText();
    this.tabsWithIconAndText = service.getTabsWithIconAndText();
    this.tabsWithIcon = service.getTabsWithIcon();
    this.orientation = this.orientations[0];
    this.stylingMode = this.stylingModes[1];
    this.iconPosition = this.iconPositions[0];
  }

  onOrientationChanged(e) {
    this.widgetWrapperClasses = `widget-wrapper widget-wrapper-${e.value}`;
    this.setTabsOption('orientation', e.value);
  }

  onFullWidthChanged(e) {
    this.setTabsOption('width', e.value ? '100%' : 'auto');
  }

  setTabsOption(option, value) {
    this.withText.instance.option(option, value);
    this.withIconAndText.instance.option(option, value);
    this.withIcon.instance.option(option, value);
  }
}

@NgModule({
  imports: [
    BrowserModule,
    BrowserTransferStateModule,
    DxTabsModule,
    DxCheckBoxModule,
    DxSelectBoxModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
