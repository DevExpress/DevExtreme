import { Component, enableProdMode, inject } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { HttpClient, provideHttpClient, withFetch } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';

import { type DxTreeViewComponent, DxTreeViewModule } from 'devextreme-angular';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  templateUrl: './app.component.html',
  providers: [],
  imports: [DxTreeViewModule],
})
export class AppComponent {
  private readonly http = inject(HttpClient);

  readonly createChildren: DxTreeViewComponent['createChildren'] = (parent: Record<string, { id: unknown }>) => {
    const parentId = parent ? parent.itemData.id : '';

    return lastValueFrom(
      this.http.get(`https://js.devexpress.com/Demos/NetCore/api/TreeViewData?parentId=${parentId}`),
    );
  };
}

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(withFetch()),
  ],
});
