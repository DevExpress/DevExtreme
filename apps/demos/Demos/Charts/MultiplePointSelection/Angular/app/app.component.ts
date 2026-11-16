import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, inject } from '@angular/core';
import { DxChartModule, DxChartTypes } from 'devextreme-angular/ui/chart';
import { Service } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  providers: [Service],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [
    DxChartModule,
  ],
})
export class AppComponent {
  readonly medalsInfo = inject(Service).getMedalsInfo();

  pointClick({ target: point }: DxChartTypes.PointClickEvent) {
    if (point.isSelected()) {
      point.clearSelection();
    } else {
      point.select();
    }
  }
}

bootstrapApplication(AppComponent);
