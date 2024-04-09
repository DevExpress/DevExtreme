import {
  NgModule, ViewChild, Component, enableProdMode, Pipe, PipeTransform,
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
import { DxSchedulerTypes } from 'devextreme-angular/ui/scheduler';
import { DxNumberBoxTypes } from 'devextreme-angular/ui/number-box';
import { Appointment, Service, MovieData } from './app.service';

@Pipe({ name: 'apply' })
export class ApplyPipe<TArgs, TReturn> implements PipeTransform {
  transform(func: ((...args: TArgs[]) => TReturn), ...args: TArgs[]): TReturn { return func(...args); }
}

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

  onContentReady = (e: DxSchedulerTypes.ContentReadyEvent) => {
    e.component.scrollTo(new Date());
  };

  onAppointmentClick = (e: DxSchedulerTypes.AppointmentClickEvent) => {
    e.cancel = true;
  };

  onAppointmentDblClick = (e: DxSchedulerTypes.AppointmentDblClickEvent) => {
    e.cancel = true;
  };

  changeIndicatorUpdateInterval = (e: DxNumberBoxTypes.ValueChangedEvent) => {
    this.indicatorUpdateInterval = e.value * 1000;
  };

  getMovieById = (id: string | number) => Query(this.moviesData).filter(['id', '=', id]).toArray()[0];
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
  declarations: [AppComponent, ApplyPipe],
  bootstrap: [AppComponent],
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
