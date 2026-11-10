import { bootstrapApplication } from '@angular/platform-browser';
import {
  Component, enableProdMode, inject, signal, viewChild,
} from '@angular/core';
import {
  DxChartComponent, DxChartModule, DxDropDownButtonModule, DxToolbarModule,
} from 'devextreme-angular';
import type { DxChartTypes } from 'devextreme-angular/ui/chart';
import type { DxButtonTypes } from 'devextreme-angular/ui/button';
import type { DxDropDownButtonTypes } from 'devextreme-angular/ui/drop-down-button';
import type { VisualRange } from 'devextreme-angular/common/charts';
import { formatDate } from 'devextreme/localization';
import { Service } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

const dayMs = 24 * 60 * 60 * 1000;
const panStepFraction = 0.25;
const zoomFactor = 0.75;
const minVisualRangeLength = { days: 3 };
const minVisibleSpanMs = minVisualRangeLength.days * dayMs;

const exportFormats = ['PNG', 'PDF', 'JPEG', 'SVG'] as const;
const exportItems = [
  { text: 'Print' },
  ...exportFormats.map((format) => ({ text: `${format} file`, format })),
];

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
    DxDropDownButtonModule,
    DxToolbarModule,
  ],
})
export class AppComponent {
  private readonly chart = viewChild.required(DxChartComponent);

  readonly minVisualRange = minVisualRangeLength;

  readonly stockPrices = inject(Service).getStockPrices();

  private readonly dataMin = this.stockPrices[0].date.getTime();

  private readonly dataMax = this.stockPrices[this.stockPrices.length - 1].date.getTime();

  private readonly rangeMin = this.dataMin - dayMs / 2;

  private readonly rangeMax = this.dataMax + dayMs / 2;

  private readonly initialStart = new Date(this.rangeMin);

  private readonly initialEnd = new Date(1994, 3, 29, 12);

  readonly visualRange = signal<VisualRange>({
    startValue: this.initialStart,
    endValue: this.initialEnd,
  });

  readonly panLeftButtonOptions: DxButtonTypes.Properties = {
    icon: 'arrowleft',
    hint: 'Pan Left',
    elementAttr: { 'aria-label': 'Pan Left' },
    onClick: () => this.pan(-1),
  };

  readonly panRightButtonOptions: DxButtonTypes.Properties = {
    icon: 'arrowright',
    hint: 'Pan Right',
    elementAttr: { 'aria-label': 'Pan Right' },
    onClick: () => this.pan(1),
  };

  readonly zoomInButtonOptions: DxButtonTypes.Properties = {
    icon: 'zoominoutline',
    hint: 'Zoom In',
    elementAttr: { 'aria-label': 'Zoom In' },
    onClick: () => this.zoom(zoomFactor),
  };

  readonly zoomOutButtonOptions: DxButtonTypes.Properties = {
    icon: 'zoomoutoutline',
    hint: 'Zoom Out',
    elementAttr: { 'aria-label': 'Zoom Out' },
    onClick: () => this.zoom(1 / zoomFactor),
  };

  readonly resetZoomButtonOptions: DxButtonTypes.Properties = {
    icon: 'refresh',
    hint: 'Reset Zoom',
    elementAttr: { 'aria-label': 'Reset Zoom' },
    onClick: () => this.resetZoom(),
  };

  readonly exportButtonOptions: DxDropDownButtonTypes.Properties = {
    icon: 'export',
    hint: 'Exporting/Printing',
    stylingMode: 'text',
    useSelectMode: false,
    dropDownOptions: { width: 100 },
    displayExpr: 'text',
    items: exportItems,
    onItemClick: ({ itemData }) => {
      if (itemData.format) {
        this.chart().instance.exportTo('file', itemData.format);
      } else {
        this.chart().instance.print();
      }
    },
  };

  private getRange() {
    const { startValue, endValue } = this.visualRange();

    return {
      start: (startValue as Date).getTime(),
      end: (endValue as Date).getTime(),
    };
  }

  private setRange(start: number, end: number) {
    const span = clamp(end - start, minVisibleSpanMs, this.rangeMax - this.rangeMin);
    const center = (start + end) / 2;
    const newStart = clamp(center - span / 2, this.rangeMin, this.rangeMax - span);

    this.visualRange.set({
      startValue: new Date(newStart),
      endValue: new Date(newStart + span),
    });
  }

  private pan(direction: number) {
    const { start, end } = this.getRange();
    const shift = (end - start) * panStepFraction * direction;
    this.setRange(start + shift, end + shift);
  }

  private zoom(factor: number) {
    const { start, end } = this.getRange();
    const center = (start + end) / 2;
    const half = ((end - start) * factor) / 2;
    this.setRange(center - half, center + half);
  }

  private resetZoom() {
    this.setRange(this.initialStart.getTime(), this.initialEnd.getTime());
  }

  customizeLabelText({ value }: { value?: Date | number | string }) {
    const date = value as Date;
    const isMidnight = date.getHours() === 0 && date.getMinutes() === 0;

    return formatDate(date, isMidnight ? 'MMM dd' : 'shortTime');
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

bootstrapApplication(AppComponent);
