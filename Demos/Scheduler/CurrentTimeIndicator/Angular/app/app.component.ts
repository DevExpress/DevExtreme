import {
  NgModule, ViewChild, Component, enableProdMode,
} from '@angular/core';
import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import {
  DxSchedulerModule,
  DxSchedulerComponent,
  DxTemplateModule,
  DxSwitchModule,
  DxNumberBoxModule,
} from 'devextreme-angular';
import Query from 'devextreme/data/query';
import { Appointment, Service, MovieData } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  templateUrl: 'app/app.component.html',
  styleUrls: ['app/app.component.css'],
  providers: [Service],
  preserveWhitespaces: true,
})
export class AppComponent {
  @ViewChild(DxSchedulerComponent, { static: false }) scheduler: DxSchedulerComponent;

  appointmentsData: Appointment[];

  moviesData: MovieData[];

  currentDate: Date = new Date();

  showCurrentTimeIndicator = true;

  shadeUntilCurrentTime = true;

  intervalValue = 10;

  indicatorUpdateInterval = 10000;

  constructor(service: Service) {
    this.appointmentsData = service.getAppointments();
    this.moviesData = service.getMoviesData();
  }

  onContentReady(e) {
    e.component.scrollTo(new Date());
  }

  onAppointmentClick(e) {
    e.cancel = true;
  }

  onAppointmentDblClick(e) {
    e.cancel = true;
  }

  changeIndicatorUpdateInterval(e) {
    this.indicatorUpdateInterval = e.value * 1000;
  }

  getMovieById(id) {
    return Query(this.moviesData).filter(['id', '=', id]).toArray()[0];
  }
}

@NgModule({
  imports: [
    BrowserModule,
    BrowserTransferStateModule,
    DxSchedulerModule,
    DxSwitchModule,
    DxNumberBoxModule,
    DxTemplateModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
