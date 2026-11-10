import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, inject } from '@angular/core';
import { HttpClient, provideHttpClient, withFetch } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';

import { DxSparklineModule, DxSelectBoxModule } from 'devextreme-angular';
import { DataSource, CustomStore } from 'devextreme-angular/common/data';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [
    DxSparklineModule,
    DxSelectBoxModule,
  ],
})
export class AppComponent {
  private readonly http = inject(HttpClient);

  readonly source = new DataSource({
    store: new CustomStore({
      load: () => lastValueFrom(this.http.get('../../../../data/resourceData.json'))
        .catch(() => { throw new Error('Data Loading Error'); }),
      loadMode: 'raw',
    }),
    filter: ['month', '<=', '12'],
    paginate: false,
  });

  readonly filters = [12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1];

  readonly years = [2021, 2022, 2023];

  onValueChanged(e) {
    const count = e.value;
    this.source.filter(['month', '<=', count]);
    this.source.load();
  }
}

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(withFetch()),
  ],
});
