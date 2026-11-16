import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, inject } from '@angular/core';
import { DxFunnelModule } from 'devextreme-angular';
import { Service } from './app.service';

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
  readonly data = inject(Service).getData();

  readonly customizeText = ({ percentText, item: { argument } }) => `<span style='font-size: 28px'>${percentText}</span><br/>${argument}`;
}

bootstrapApplication(AppComponent);
