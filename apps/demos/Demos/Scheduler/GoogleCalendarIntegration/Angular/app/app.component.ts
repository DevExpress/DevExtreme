import {
  NgModule, Component, enableProdMode,
} from '@angular/core';
import { HttpClient, provideHttpClient, withFetch } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { lastValueFrom } from 'rxjs';
import { DxSchedulerModule } from 'devextreme-angular';
import { DataSource, CustomStore } from 'devextreme-angular/common/data';

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
})
export class AppComponent {
  dataSource = new DataSource({
    store: new CustomStore({
      load: () => this.getData({ showDeleted: false }),
    }),
  });

  currentDate = new Date(2017, 4, 25);

  constructor(private http: HttpClient) {}

  private getData(requestOptions: Record<string, unknown>) {
    const PUBLIC_KEY = 'AIzaSyBnNAISIUKe6xdhq1_rjor2rxoI3UlMY7k';
    const CALENDAR_ID = 'f7jnetm22dsjc3npc2lu3buvu4@group.calendar.google.com';
    const dataUrl = [
      'https://www.googleapis.com/calendar/v3/calendars/',
      CALENDAR_ID,
      '/events?key=',
      PUBLIC_KEY,
    ].join('');

    return lastValueFrom(this.http.get(dataUrl, requestOptions))
      .then(({ items }: Record<string, unknown>) => items);
  }
}

@NgModule({
  imports: [
    BrowserModule,
    DxSchedulerModule,
  ],
  providers: [provideHttpClient(withFetch())],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
