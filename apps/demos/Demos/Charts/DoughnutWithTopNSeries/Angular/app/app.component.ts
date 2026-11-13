import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, inject } from '@angular/core';
import { DxPieChartModule } from 'devextreme-angular';
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
    DxPieChartModule,
  ],
})

export class AppComponent {
  readonly internetLanguages = inject(Service).getLanguagesData();

  customizeLabel(point) {
    return `${point.argumentText}: ${point.valueText}%`;
  }
}

bootstrapApplication(AppComponent);
