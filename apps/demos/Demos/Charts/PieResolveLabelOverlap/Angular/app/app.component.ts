import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, inject } from '@angular/core';
import { DxPieChartModule, DxSelectBoxModule } from 'devextreme-angular';
import { Service } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [Service],
  preserveWhitespaces: true,
  imports: [
    DxPieChartModule,
    DxSelectBoxModule,
  ],
})

export class AppComponent {
  readonly olympicMedals = inject(Service).getMedalsData();

  readonly resolveOverlappingTypes = ['shift', 'hide', 'none'];

  customizeLabel(arg) {
    return `${arg.argumentText} (${arg.percentText})`;
  }
}

bootstrapApplication(AppComponent);
