import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxStepperModule } from 'devextreme-angular';
import { type DxStepperTypes } from 'devextreme-angular/ui/stepper';
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
  standalone: false,
  selector: 'demo-app',
  templateUrl: `.${modulePrefix}/app.component.html`,
  styleUrls: [`.${modulePrefix}/app.component.css`],
})
export class AppComponent {
  steps: DxStepperTypes.Item[];

  constructor(private readonly appService: AppService) {
    this.steps = this.appService.getSteps();
  }
}

@NgModule({
  imports: [
    BrowserModule,
    DxStepperModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
  providers: [AppService],
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
