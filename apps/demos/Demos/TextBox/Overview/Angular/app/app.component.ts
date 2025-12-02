import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, provideZoneChangeDetection } from '@angular/core';
import { DxTextBoxModule, DxTextBoxTypes } from 'devextreme-angular/ui/text-box';

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
  imports: [
    DxTextBoxModule,
  ],
})
export class AppComponent {
  emailValue = 'smith@corp.com';

  rules = { X: /[02-9]/ };

  valueChanged(data: DxTextBoxTypes.ValueChangedEvent) {
    this.emailValue = `${data.value.replace(/\s/g, '').toLowerCase()}@corp.com`;
  }
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true, runCoalescing: true }),
  ],
});
