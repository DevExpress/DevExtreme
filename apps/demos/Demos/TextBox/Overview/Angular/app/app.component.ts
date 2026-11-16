import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, signal } from '@angular/core';
import { DxTextBoxModule, type DxTextBoxTypes } from 'devextreme-angular/ui/text-box';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  templateUrl: './app.component.html',
  imports: [
    DxTextBoxModule,
  ],
})
export class AppComponent {
  readonly emailValue = signal('smith@corp.com');

  readonly rules = { X: /[02-9]/ };

  valueChanged(data: DxTextBoxTypes.ValueChangedEvent) {
    this.emailValue.set(`${data.value.replace(/\s/g, '').toLowerCase()}@corp.com`);
  }
}

bootstrapApplication(AppComponent);
