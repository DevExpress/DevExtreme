import { bootstrapApplication } from '@angular/platform-browser';
import {
  Component, enableProdMode, inject, signal, viewChild,
} from '@angular/core';
import { DecimalPipe, CurrencyPipe } from '@angular/common';
import { HubConnectionBuilder, HttpTransportType } from '@aspnet/signalr';
import { CustomStore } from 'devextreme-angular/common/data';
import { DxChartModule, DxChartComponent, DxChartTypes } from 'devextreme-angular/ui/chart';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [DecimalPipe, CurrencyPipe],
  imports: [
    DxChartModule,
  ],
})
export class AppComponent {
  private readonly component = viewChild.required(DxChartComponent);

  private readonly decimalPipe = inject(DecimalPipe);

  private readonly currencyPipe = inject(CurrencyPipe);

  readonly dataSource = signal<CustomStore | null>(null);

  constructor() {
    const hubConnection = new HubConnectionBuilder()
      .withUrl('https://js.devexpress.com/Demos/NetCore/stockTickDataHub', {
        skipNegotiation: true,
        transport: HttpTransportType.WebSockets,
      })
      .build();

    const store = new CustomStore({
      load: () => hubConnection.invoke('getAllData'),
      key: 'date',
    });

    hubConnection
      .start()
      .then(() => {
        hubConnection.on('updateStockPrice', (data: Record<string, unknown>) => {
          store.push([{ type: 'insert', key: data.date, data }]);
        });
        this.dataSource.set(store);
      });
  }

  calculateCandle(e: Record<string, Date> & { data: Record<string, unknown>[] }) {
    const prices: unknown[] = e.data.map((d) => d.price);
    if (prices.length) {
      return {
        date: new Date((e.intervalStart.valueOf() + e.intervalEnd.valueOf()) / 2),
        open: prices[0],
        high: Math.max.apply(null, prices),
        low: Math.min.apply(null, prices),
        close: prices[prices.length - 1],
      };
    }
    return null;
  }

  readonly customizePoint: DxChartTypes.Properties['customizePoint'] = ({ seriesName, argument }) => {
    if (seriesName === 'Volume') {
      const point = this.component().instance.getAllSeries()[0].getPointsByArg(argument)[0].data;
      if (point.close >= point.open) {
        return { color: '#1db2f5' };
      }
    }
    return null;
  };

  readonly formatPrice = (points: { seriesName: string, [key: string]: string }[], field: string) => {
    const pricePoint = points.find((point) => point.seriesName !== 'Volume');
    return this.currencyPipe.transform(pricePoint[field], 'USD', 'symbol', '1.0-0');
  };

  readonly formatVolume = (points: { seriesName: string, [key: string]: string }[]) => {
    const volPoint = points.find((point) => point.seriesName === 'Volume');
    return this.decimalPipe.transform(volPoint.value, '3.0-0');
  };
}

bootstrapApplication(AppComponent);
