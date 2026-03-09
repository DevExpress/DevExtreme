import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, provideZoneChangeDetection } from '@angular/core';
import { HubConnectionBuilder, HttpTransportType } from '@aspnet/signalr';
import { DxSchedulerModule } from 'devextreme-angular';
import * as AspNetData from 'devextreme-aspnet-data-nojquery';
import 'anti-forgery';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

const BASE_PATH = 'https://js.devexpress.com/Demos/NetCore/';
const url = `${BASE_PATH}api/SchedulerSignalR`;
const createStore = () => AspNetData.createStore({
  key: 'AppointmentId',
  loadUrl: url,
  insertUrl: url,
  updateUrl: url,
  deleteUrl: url,
  onBeforeSend(method, ajaxOptions) {
    ajaxOptions.xhrFields = { withCredentials: true };
  },
});

const store1 = createStore();
const store2 = createStore();

const connection = new HubConnectionBuilder()
  .withUrl(`${BASE_PATH}schedulerSignalRHub`, {
    skipNegotiation: true,
    transport: HttpTransportType.WebSockets,
  })
  .build();

connection
  .start()
  .then(() => {
    connection.on('update', (key, data) => {
      store1.push([{ type: 'update', key, data }]);
      store2.push([{ type: 'update', key, data }]);
    });

    connection.on('insert', (data) => {
      store1.push([{ type: 'insert', data }]);
      store2.push([{ type: 'insert', data }]);
    });

    connection.on('remove', (key) => {
      store1.push([{ type: 'remove', key }]);
      store2.push([{ type: 'remove', key }]);
    });
  });

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
    DxSchedulerModule,
  ],
})
export class AppComponent {
  store1: AspNetData.CustomStore = store1;

  store2: AspNetData.CustomStore = store2;

  currentDate = new Date(2021, 3, 27);
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true, runCoalescing: true }),
  ],
});
