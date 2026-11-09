import { bootstrapApplication } from '@angular/platform-browser';
import {
  Component, enableProdMode, inject, Pipe, signal, type PipeTransform,
} from '@angular/core';
import {
  DxSchedulerModule,
  DxSwitchModule,
  DxNumberBoxModule,
} from 'devextreme-angular';
import { query as Query } from 'devextreme-angular/common/data';
import type { DxSchedulerTypes } from 'devextreme-angular/ui/scheduler';
import type { DxNumberBoxTypes } from 'devextreme-angular/ui/number-box';
import { Service, type MovieData } from './app.service';

@Pipe({ name: 'apply' })
export class ApplyPipe<TArgs, TReturn> implements PipeTransform {
  transform(func: ((...args: TArgs[]) => TReturn), ...args: TArgs[]): TReturn { return func(...args); }
}

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
    DxSchedulerModule,
    DxSwitchModule,
    DxNumberBoxModule,
    ApplyPipe,
  ],
})
export class AppComponent {
  private readonly service = inject(Service);

  readonly appointmentsData = this.service.getAppointments();

  readonly moviesData = this.service.getMoviesData();

  readonly currentDate = new Date();

  readonly showCurrentTimeIndicator = signal(true);

  readonly shadeUntilCurrentTime = signal(true);

  readonly intervalValue = signal(10);

  readonly indicatorUpdateInterval = signal(10000);

  readonly onContentReady = (e: DxSchedulerTypes.ContentReadyEvent) => {
    e.component.scrollTo(new Date());
  };

  readonly onAppointmentClick = (e: DxSchedulerTypes.AppointmentClickEvent) => {
    e.cancel = true;
  };

  readonly onAppointmentDblClick = (e: DxSchedulerTypes.AppointmentDblClickEvent) => {
    e.cancel = true;
  };

  readonly changeIndicatorUpdateInterval = (e: DxNumberBoxTypes.ValueChangedEvent) => {
    this.indicatorUpdateInterval.set(e.value * 1000);
  };

  readonly getMovieById = (id: string | number) => Query(this.moviesData).filter(['id', '=', id]).toArray()[0] as MovieData;
}

bootstrapApplication(AppComponent);
