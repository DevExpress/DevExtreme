import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, provideZoneChangeDetection } from '@angular/core';
import { DxButtonModule, DxLoadIndicatorModule } from 'devextreme-angular';

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
  imports: [
    DxButtonModule,
    DxLoadIndicatorModule,
  ],
})
export class AppComponent {
  loadIndicatorVisible = false;

  buttonText = 'Send';

  onClick() {
    this.buttonText = 'Sending';
    this.loadIndicatorVisible = true;

    setTimeout(() => {
      this.buttonText = 'Send';
      this.loadIndicatorVisible = false;
    }, 2000);
  }
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true, runCoalescing: true }),
  ],
});
