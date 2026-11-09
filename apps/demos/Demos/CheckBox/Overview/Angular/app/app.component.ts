import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, signal } from '@angular/core';
import { DxCheckBoxModule } from 'devextreme-angular';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  templateUrl: './app.component.html',
  imports: [
    DxCheckBoxModule,
  ],
})
export class AppComponent {
  readonly checkBoxValue = signal<boolean | null>(null);
}

bootstrapApplication(AppComponent);
