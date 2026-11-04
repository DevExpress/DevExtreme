import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, signal } from '@angular/core';
import { DxSliderModule, DxNumberBoxModule } from 'devextreme-angular';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [
    DxSliderModule,
    DxNumberBoxModule,
  ],
})

export class AppComponent {
  readonly value = signal(10);

  readonly format = (value: string) => `${value}%`;
}

bootstrapApplication(AppComponent);
