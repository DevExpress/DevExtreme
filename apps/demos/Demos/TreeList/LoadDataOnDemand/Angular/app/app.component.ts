import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, inject } from '@angular/core';
import { HttpClient, HttpParams, provideHttpClient, withFetch } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { DxTreeListModule } from 'devextreme-angular';
import { DataSource } from 'devextreme-angular/common/data';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [
    DxTreeListModule,
  ],
})
export class AppComponent {
  private readonly http = inject(HttpClient);

  readonly dataSource = new DataSource({
    load: (loadOptions) => {
      let params = new HttpParams();
      if (loadOptions.parentIds) {
        loadOptions.parentIds.forEach((id) => {
          params = params.append('parentIds', id);
        });
      }
      return lastValueFrom(
        this.http.get('https://js.devexpress.com/Demos/NetCore/api/treeListData', { params }),
      );
    },
  });

  readonly customizeSizeText = ({ value }) => (value === null ? '' : `${Math.ceil(value / 1024)} KB`);
}

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(withFetch()),
  ],
});
