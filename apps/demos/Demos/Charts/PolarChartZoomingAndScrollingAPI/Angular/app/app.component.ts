import { bootstrapApplication } from '@angular/platform-browser';
import {
  Component, enableProdMode, inject, signal,
} from '@angular/core';
import { DxRangeSelectorModule } from 'devextreme-angular';
import { DxPolarChartModule, DxPolarChartTypes } from 'devextreme-angular/ui/polar-chart';
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
    DxPolarChartModule,
    DxRangeSelectorModule,
  ],
})
export class AppComponent {
  readonly dataSource = inject(Service).getDataSource();

  readonly visualRange = signal<DxPolarChartTypes.ValueAxis['visualRange']>({ startValue: 0, endValue: 8 });
}

bootstrapApplication(AppComponent);
