import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { HttpClient, HttpClientModule, HttpParams } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { DxDataGridModule } from 'devextreme-angular';
import CustomStore from 'devextreme/data/custom_store';
import { LoadOptions } from 'devextreme/data';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  templateUrl: 'app/app.component.html',
})
export class AppComponent {
  url: string;

  dataSource = {} as CustomStore;

  constructor(httpClient: HttpClient) {
    const isNotEmpty = (value: unknown) => (value !== undefined && value !== null && value !== '');

    this.dataSource = new CustomStore({
      key: 'OrderNumber',
      async load(loadOptions: LoadOptions) {
        const url = 'https://js.devexpress.com/Demos/WidgetsGalleryDataService/api/orders';

        const paramNames = [
          'skip', 'take', 'requireTotalCount', 'requireGroupCount',
          'sort', 'filter', 'totalSummary', 'group', 'groupSummary',
        ];

        let params = new HttpParams();

        paramNames
          .filter((paramName) => isNotEmpty(loadOptions[paramName]))
          .forEach((paramName) => {
            params = params.set(paramName, JSON.stringify(loadOptions[paramName]));
          });

        try {
          const result = await lastValueFrom(httpClient.get(url, { params })) as Record<string, unknown>;

          return {
            data: result.data,
            totalCount: result.totalCount,
            summary: result.summary,
            groupCount: result.groupCount,
          };
        } catch (err) {
          throw new Error('Data Loading Error');
        }
      },
    });
  }
}

@NgModule({
  imports: [
    BrowserModule,
    BrowserTransferStateModule,
    DxDataGridModule,
    HttpClientModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
