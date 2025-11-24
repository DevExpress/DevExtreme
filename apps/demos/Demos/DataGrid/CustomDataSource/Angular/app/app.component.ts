import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, provideZoneChangeDetection } from '@angular/core';
import { HttpClient, HttpParams, provideHttpClient, withFetch } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { DxDataGridModule } from 'devextreme-angular';
import { CustomStore, LoadOptions } from 'devextreme-angular/common/data';

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
  imports: [
    DxDataGridModule,
  ],
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
        } catch {
          throw new Error('Data Loading Error');
        }
      },
    });
  }
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true, runCoalescing: true }),
    provideHttpClient(withFetch()),
  ],
});
