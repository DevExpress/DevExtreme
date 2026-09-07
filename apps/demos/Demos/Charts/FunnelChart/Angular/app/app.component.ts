import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, provideZoneChangeDetection } from '@angular/core';
import { DxFunnelModule } from 'devextreme-angular';
import { itemInfo, Service } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [Service],
  imports: [
    DxFunnelModule,
  ],
})
export class AppComponent {
  data: itemInfo[];

  constructor(service: Service) {
    this.data = service.getData();
  }

  customizeText = ({ percentText, item: { argument } }) => `<span style='font-size: 28px'>${percentText}</span><br/>${argument}`;
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true, runCoalescing: true }),
  ],
});
