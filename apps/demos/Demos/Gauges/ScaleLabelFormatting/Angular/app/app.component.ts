import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, provideZoneChangeDetection } from '@angular/core';
import { DxCircularGaugeModule, DxCircularGaugeTypes } from 'devextreme-angular/ui/circular-gauge';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [
    DxCircularGaugeModule,
  ],
})
export class AppComponent {
  customizeText: DxCircularGaugeTypes.ScaleLabel['customizeText'] = ({ valueText }) => `${valueText} %`;
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true, runCoalescing: true }),
  ],
});
