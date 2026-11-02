import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, inject } from '@angular/core';
import { DxDataGridModule } from 'devextreme-angular';
import { Service } from './app.service';
import { DetailGridComponent } from './detail-grid/detail-grid.component';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [Service],
  imports: [
    DxDataGridModule,
    DetailGridComponent,
  ],
})
export class AppComponent {
  readonly employees = inject(Service).getEmployees();
}

bootstrapApplication(AppComponent);
