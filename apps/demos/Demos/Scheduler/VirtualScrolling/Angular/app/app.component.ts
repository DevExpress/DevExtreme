import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, inject } from '@angular/core';
import { DxSchedulerModule } from 'devextreme-angular';
import { Service } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [Service],
  imports: [
    DxSchedulerModule,
  ],
})
export class AppComponent {
  private readonly service = inject(Service);

  readonly resources = this.service.resources;

  readonly appointments = this.service.generateAppointments(new Date(2021, 1, 1), new Date(2021, 1, 28), 8, 20);

  readonly currentDate = new Date(2021, 1, 2);
}

bootstrapApplication(AppComponent);
