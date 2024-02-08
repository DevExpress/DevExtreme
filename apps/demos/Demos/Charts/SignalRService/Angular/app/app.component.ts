import {
  NgModule, Component, ViewChild, enableProdMode,
} from '@angular/core';
import { DecimalPipe, CurrencyPipe } from '@angular/common';
import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { HubConnectionBuilder, HttpTransportType } from '@aspnet/signalr';
import CustomStore from 'devextreme/data/custom_store';
import { DxChartModule, DxChartComponent, DxChartTypes } from 'devextreme-angular/ui/chart';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  templateUrl: 'app/app.component.html',
  styleUrls: ['app/app.component.css'],
  providers: [DecimalPipe, CurrencyPipe],
})
export class AppComponent {
  @ViewChild(DxChartComponent, { static: false }) component: DxChartComponent;

  dataSource: CustomStore;

  connectionStarted = false;

  constructor(private decimalPipe: DecimalPipe, private currencyPipe: CurrencyPipe) {
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
        this.dataSource = store;
        this.connectionStarted = true;
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
  }

  customizePoint: DxChartTypes.Properties['customizePoint'] = ({ seriesName, argument }) => {
    if (seriesName === 'Volume') {
      const point = this.component.instance.getAllSeries()[0].getPointsByArg(argument)[0].data;
      if (point.close >= point.open) {
        return { color: '#1db2f5' };
      }
    }
  };

  formatPrice = (points: { seriesName: string, [key: string]: string }[], field: string) => {
    const pricePoint = points.find((point) => point.seriesName !== 'Volume');
    return this.currencyPipe.transform(pricePoint[field], 'USD', 'symbol', '1.0-0');
  };

  formatVolume = (points: { seriesName: string, [key: string]: string }[]) => {
    const volPoint = points.find((point) => point.seriesName === 'Volume');
    return this.decimalPipe.transform(volPoint.value, '3.0-0');
  };
}

@NgModule({
  imports: [
    BrowserModule,
    BrowserTransferStateModule,
    DxChartModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
