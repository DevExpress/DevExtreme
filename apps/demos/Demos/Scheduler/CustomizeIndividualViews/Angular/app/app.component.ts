import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxSchedulerModule, DxTemplateModule } from 'devextreme-angular';
import DataSource from 'devextreme/data/data_source';
import { Service, PriorityData, TypeData } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [Service],
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

@NgModule({
  imports: [
    BrowserModule,
    DxSchedulerModule,
    DxTemplateModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
