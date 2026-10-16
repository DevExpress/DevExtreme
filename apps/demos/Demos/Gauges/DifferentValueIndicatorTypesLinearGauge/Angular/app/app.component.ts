import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, provideZoneChangeDetection } from '@angular/core';
import { DxLinearGaugeModule, DxLinearGaugeTypes } from 'devextreme-angular/ui/linear-gauge';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [
    DxLinearGaugeModule,
  ],
})
export class AppComponent {
  customizeText: DxLinearGaugeTypes.ScaleLabel['customizeText'] = ({ valueText }) => `${valueText} %`;
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true, runCoalescing: true }),
  ],
});
