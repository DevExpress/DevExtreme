import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxSchedulerModule } from 'devextreme-angular';
import * as AspNetData from 'devextreme-aspnet-data-nojquery';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

const url = 'https://js.devexpress.com/Demos/Mvc/api/SchedulerData';

@Component({
  selector: 'demo-app',
  templateUrl: 'app/app.component.html',
})
export class AppComponent {
  currentDate = new Date(2021, 3, 27);

  appointmentsData: AspNetData.CustomStore = AspNetData.createStore({
    key: 'AppointmentId',
    loadUrl: `${url}/Get`,
    insertUrl: `${url}/Post`,
    updateUrl: `${url}/Put`,
    deleteUrl: `${url}/Delete`,
    onBeforeSend(method, ajaxOptions) {
      ajaxOptions.xhrFields = { withCredentials: true };
    },
  });
}

@NgModule({
  imports: [
    BrowserModule,
    BrowserTransferStateModule,
    DxSchedulerModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
