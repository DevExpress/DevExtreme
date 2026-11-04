import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, signal } from '@angular/core';
import { DxCircularGaugeModule, DxLinearGaugeModule, DxSliderModule } from 'devextreme-angular';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  preserveWhitespaces: true,
  imports: [
    DxCircularGaugeModule,
    DxLinearGaugeModule,
    DxSliderModule,
  ],
})

export class AppComponent {
  readonly speedValue = signal(40);

  readonly color = '#f05b41';
}

bootstrapApplication(AppComponent);
