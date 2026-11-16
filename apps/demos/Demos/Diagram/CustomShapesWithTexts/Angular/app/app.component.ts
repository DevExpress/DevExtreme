import { bootstrapApplication } from '@angular/platform-browser';
import {
  Component, enableProdMode, inject, viewChild,
} from '@angular/core';
import { HttpClient, provideHttpClient, withFetch } from '@angular/common/http';

import { DxDiagramModule, DxDiagramComponent } from 'devextreme-angular';
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
  readonly employees = inject(Service).getEmployees();

  private readonly diagram = viewChild.required(DxDiagramComponent);

  constructor() {
    inject(HttpClient).get('../../../../data/diagram-employees.json').subscribe({
      next: (data) => { this.diagram().instance.import(JSON.stringify(data)); },
      error: () => { throw new Error('Data Loading Error'); },
    });
  }
}

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(withFetch()),
  ],
});
