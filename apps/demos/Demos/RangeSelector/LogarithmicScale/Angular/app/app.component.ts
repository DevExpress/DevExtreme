import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, signal } from '@angular/core';
import { DxRangeSelectorModule } from 'devextreme-angular';
import { DxChartModule, type DxChartTypes } from 'devextreme-angular/ui/chart';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [
    DxRangeSelectorModule,
    DxChartModule,
  ],
})
export class AppComponent {
  readonly dataSource: Record<string, unknown>[] = Array.from({ length: 100 }, (_, i) => ({
    arg: Math.pow(10, i * 0.1),
    val: Math.log(i + 1) / Math.log(0.5) + (Math.random() - 0.5) * (100 / (i + 1)) + 10,
  }));

  readonly visualRange = signal<DxChartTypes.ArgumentAxis['visualRange']>({});
}

bootstrapApplication(AppComponent);
