import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { DxButtonGroupModule, type DxButtonGroupTypes } from 'devextreme-angular/ui/button-group';
import { DxCheckBoxModule, type DxCheckBoxTypes } from 'devextreme-angular/ui/check-box';
import { DxStepperModule, type DxStepperTypes } from 'devextreme-angular/ui/stepper';

import { AppService } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
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
})
export class AppComponent {
  steps: DxStepperTypes.Item[];

  orientations: any[];

  navigationModes: any[];

  orientation: string;

  navigationMode: boolean;

  selectOnFocus: boolean = true;

  rtlMode: boolean = false;

  constructor(private readonly appService: AppService) {
    this.steps = this.appService.getSteps();
    this.orientations = this.appService.getOrientations();
    this.navigationModes = this.appService.getNavigationModes();

    this.orientation = this.orientations[0].value;
    this.navigationMode = this.navigationModes[0].value;
  }

  onOrientationClick(e: DxButtonGroupTypes.ItemClickEvent) {
    this.orientation = e.itemData.value;
  }

  onNavigationModeClick(e: DxButtonGroupTypes.ItemClickEvent) {
    this.navigationMode = e.itemData.value;
  }

  onSelectOnFocusChanged(e: DxCheckBoxTypes.ValueChangedEvent) {
    this.selectOnFocus = e.value;
  }

  onRtlModeChanged(e: DxCheckBoxTypes.ValueChangedEvent) {
    this.rtlMode = e.value;
  }
}

@NgModule({
  imports: [
    BrowserModule,
    DxStepperModule,
    DxButtonGroupModule,
    DxCheckBoxModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
  providers: [AppService],
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
