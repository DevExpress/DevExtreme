import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, inject } from '@angular/core';
import { provideHttpClient, withFetch } from '@angular/common/http';

import { DxDiagramModule } from 'devextreme-angular';
import { ArrayStore } from 'devextreme-angular/common/data';
import { Service } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [Service],
  preserveWhitespaces: true,
  imports: [
    DxDiagramModule,
  ],
})
export class AppComponent {
  readonly dataSource = new ArrayStore({
    key: 'this',
    data: inject(Service).getEmployees(),
  });
}

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(withFetch()),
  ],
});
