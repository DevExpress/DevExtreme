import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode } from '@angular/core';
import { DxTextBoxModule, DxTextAreaModule } from 'devextreme-angular';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [
    DxTextBoxModule,
    DxTextAreaModule,
  ],
})
export class AppComponent {
  constructor() {
  }
}

bootstrapApplication(AppComponent);
