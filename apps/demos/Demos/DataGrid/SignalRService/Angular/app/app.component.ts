import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, provideZoneChangeDetection } from '@angular/core';
import { HubConnectionBuilder, HttpTransportType } from '@aspnet/signalr';
import { DxDataGridModule } from 'devextreme-angular';
import { CustomStore } from 'devextreme-angular/common/data';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

let modulePrefix = '';
// @ts-ignore
if (window && window.config?.packageConfigPaths) {
  modulePrefix = '/app';
}

@Component({
  selector: 'demo-app',
  templateUrl: `.${modulePrefix}/app.component.html`,
  styleUrls: [`.${modulePrefix}/app.component.css`],
  imports: [
    DxDataGridModule,
  ],
})
export class AppComponent {
  dataSource: CustomStore;

  connectionStarted: boolean;

  constructor() {
    this.connectionStarted = false;

    const hubConnection = new HubConnectionBuilder()
      .withUrl('https://js.devexpress.com/Demos/NetCore/liveUpdateSignalRHub', {
        skipNegotiation: true,
        transport: HttpTransportType.WebSockets,
      })
      .build();

    const store = new CustomStore({
      load: () => hubConnection.invoke('getAllStocks'),
      key: 'symbol',
    });

    hubConnection
      .start()
      .then(() => {
        hubConnection.on('updateStockPrice', (data: Record<string, unknown>) => {
          store.push([{ type: 'update', key: data.symbol, data }]);
        });
        this.dataSource = store;
        this.connectionStarted = true;
      });
  }
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true, runCoalescing: true }),
  ],
});
