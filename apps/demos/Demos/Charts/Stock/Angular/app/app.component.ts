import { bootstrapApplication } from '@angular/platform-browser';
import {
  ChangeDetectorRef, Component, enableProdMode, provideZoneChangeDetection,
} from '@angular/core';
import { DxChartModule, DxToolbarModule } from 'devextreme-angular';
import type { DxChartTypes } from 'devextreme-angular/ui/chart';
import type { DxButtonTypes } from 'devextreme-angular/ui/button';
import type { VisualRange } from 'devextreme-angular/common/charts';
import { StockPrice, Service } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

const dayMs = 24 * 60 * 60 * 1000;
const panStepFraction = 0.25;
const zoomFactor = 0.75;
const minVisualRangeLength = { days: 3 };
const minVisibleSpanMs = minVisualRangeLength.days * dayMs;

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

@Component({
  selector: 'demo-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [Service],
  imports: [
    DxChartModule,
    DxToolbarModule,
  ],
})
export class AppComponent {
  minVisualRange = minVisualRangeLength;

  stockPrices: StockPrice[];

  initialStart: Date;

  initialEnd = new Date(1994, 3, 29, 12);

  visualRange: VisualRange;

  dataMin: number;

  dataMax: number;

  rangeMin: number;

  rangeMax: number;

  panLeftButtonOptions: DxButtonTypes.Properties = {
    icon: 'chevronleft',
    hint: 'Pan Left',
    elementAttr: { 'aria-label': 'Pan Left' },
    onClick: () => this.pan(-1),
  };

  panRightButtonOptions: DxButtonTypes.Properties = {
    icon: 'chevronright',
    hint: 'Pan Right',
    elementAttr: { 'aria-label': 'Pan Right' },
    onClick: () => this.pan(1),
  };

  zoomInButtonOptions: DxButtonTypes.Properties = {
    icon: 'plus',
    hint: 'Zoom In',
    elementAttr: { 'aria-label': 'Zoom In' },
    onClick: () => this.zoom(zoomFactor),
  };

  zoomOutButtonOptions: DxButtonTypes.Properties = {
    icon: 'minus',
    hint: 'Zoom Out',
    elementAttr: { 'aria-label': 'Zoom Out' },
    onClick: () => this.zoom(1 / zoomFactor),
  };

  resetZoomButtonOptions: DxButtonTypes.Properties = {
    icon: 'refresh',
    hint: 'Reset Zoom',
    elementAttr: { 'aria-label': 'Reset Zoom' },
    onClick: () => this.resetZoom(),
  };

  constructor(service: Service, private changeDetectorRef: ChangeDetectorRef) {
    this.stockPrices = service.getStockPrices();
    this.dataMin = this.stockPrices[0].date.getTime();
    this.dataMax = this.stockPrices[this.stockPrices.length - 1].date.getTime();
    this.rangeMin = this.dataMin - dayMs / 2;
    this.rangeMax = this.dataMax + dayMs / 2;
    this.initialStart = new Date(this.rangeMin);
    this.visualRange = {
      startValue: this.initialStart,
      endValue: this.initialEnd,
    };
  }

  getRange() {
    return {
      start: (this.visualRange.startValue as Date).getTime(),
      end: (this.visualRange.endValue as Date).getTime(),
    };
  }

  setRange(start: number, end: number) {
    const span = clamp(end - start, minVisibleSpanMs, this.rangeMax - this.rangeMin);
    const center = (start + end) / 2;
    const newStart = clamp(center - span / 2, this.rangeMin, this.rangeMax - span);

    this.visualRange = {
      startValue: new Date(newStart),
      endValue: new Date(newStart + span),
    };
    this.changeDetectorRef.detectChanges();
  }

  pan(direction: number) {
    const { start, end } = this.getRange();
    const shift = (end - start) * panStepFraction * direction;
    this.setRange(start + shift, end + shift);
  }

  zoom(factor: number) {
    const { start, end } = this.getRange();
    const center = (start + end) / 2;
    const half = ((end - start) * factor) / 2;
    this.setRange(center - half, center + half);
  }

  resetZoom() {
    this.setRange(this.initialStart.getTime(), this.initialEnd.getTime());
  }

  customizeTooltip(arg: DxChartTypes.PointInfo) {
    if (!('openValue' in arg)) {
      return { text: '' };
    }
    return {
      text: `Open: ${arg.openValueText}<br/>`
                + `Close: ${arg.closeValueText}<br/>`
                + `High: ${arg.highValueText}<br/>`
                + `Low: ${arg.lowValueText}<br/>`,
    };
  }
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true, runCoalescing: true }),
  ],
});
