import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, provideZoneChangeDetection } from '@angular/core';
import { DxSchedulerModule } from 'devextreme-angular';
import { DataSource } from 'devextreme-angular/common/data';
import { Service, PriorityData, TypeData } from './app.service';

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
  dataSource: DataSource;

  currentDate: Date = new Date(2021, 3, 27);

  priorityData: PriorityData[];

  typeData: TypeData[];

  constructor(service: Service) {
    this.dataSource = new DataSource({
      store: service.getData(),
    });

    this.priorityData = service.getPriorityData();
    this.typeData = service.getTypeData();
  }
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true, runCoalescing: true }),
  ],
});
