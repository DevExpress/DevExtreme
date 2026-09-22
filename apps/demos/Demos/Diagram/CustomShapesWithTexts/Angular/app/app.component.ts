import { bootstrapApplication } from '@angular/platform-browser';
import { Component, ViewChild, enableProdMode, provideZoneChangeDetection } from '@angular/core';
import { HttpClient, provideHttpClient, withFetch } from '@angular/common/http';

import { DxDiagramModule, DxDiagramComponent } from 'devextreme-angular';
import { Service, Employee } from './app.service';

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
  employees: Employee[];

  @ViewChild(DxDiagramComponent, { static: false }) diagram: DxDiagramComponent;

  constructor(service: Service, http: HttpClient) {
    this.employees = service.getEmployees();

    http.get('../../../../data/diagram-employees.json').subscribe({
      next: (data) => { this.diagram.instance.import(JSON.stringify(data)); },
      error: () => { throw new Error('Data Loading Error'); },
    });
  }
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true, runCoalescing: true }),
    provideHttpClient(withFetch()),
  ],
});
