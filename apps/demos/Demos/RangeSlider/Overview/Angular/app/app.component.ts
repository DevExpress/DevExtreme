import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, signal } from '@angular/core';
import { DxRangeSliderModule, DxNumberBoxModule } from 'devextreme-angular';
import type { DxRangeSliderTypes } from 'devextreme-angular/ui/range-slider';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [
    DxRangeSliderModule,
    DxNumberBoxModule,
  ],
})
export class AppComponent {
  readonly start = signal(10);

  readonly end = signal(90);

  private readonly format = (value: unknown) => `${value}%`;

  readonly label: NonNullable<DxRangeSliderTypes.Properties['label']> = {
    visible: true,
    format: (value: unknown) => this.format(value),
    position: 'top',
  };

  readonly tooltip: NonNullable<DxRangeSliderTypes.Properties['tooltip']> = {
    enabled: true,
    format: (value: unknown) => this.format(value),
    showMode: 'always',
    position: 'bottom',
  };

  readonly tooltipEnabled = {
    enabled: true,
  };
}

bootstrapApplication(AppComponent);
