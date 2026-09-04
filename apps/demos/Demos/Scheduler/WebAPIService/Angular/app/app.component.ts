import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, provideZoneChangeDetection } from '@angular/core';
import { DxSchedulerModule } from 'devextreme-angular';
import * as AspNetData from 'devextreme-aspnet-data-nojquery';
import 'anti-forgery';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

const url = 'https://js.devexpress.com/Demos/NetCore/api/SchedulerData';

@Component({
  selector: 'demo-app',
  templateUrl: './app.component.html',
  imports: [
    DxSchedulerModule,
  ],
})
export class AppComponent {
  currentDate = new Date(2021, 3, 27);

  appointmentsData: AspNetData.CustomStore = AspNetData.createStore({
    key: 'AppointmentId',
    loadUrl: url,
    insertUrl: url,
    updateUrl: url,
    deleteUrl: url,
    onBeforeSend(method, ajaxOptions) {
      ajaxOptions.xhrFields = { withCredentials: true };
    },
  });
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true, runCoalescing: true }),
  ],
});
