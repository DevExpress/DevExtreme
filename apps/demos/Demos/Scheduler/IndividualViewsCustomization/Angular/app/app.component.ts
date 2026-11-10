import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, inject } from '@angular/core';
import { DxSchedulerModule } from 'devextreme-angular';
import { DataSource } from 'devextreme-angular/common/data';
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

  readonly dataSource = new DataSource({
    store: this.service.getData(),
  });

  readonly currentDate = new Date(2021, 3, 27);

  readonly priorityData = this.service.getPriorityData();

  readonly typeData = this.service.getTypeData();
}

bootstrapApplication(AppComponent);
