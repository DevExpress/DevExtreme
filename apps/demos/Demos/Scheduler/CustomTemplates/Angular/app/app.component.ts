import {
  NgModule, Component, ViewChild, enableProdMode, Pipe, PipeTransform,
} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxTemplateModule } from 'devextreme-angular';
import Query from 'devextreme/data/query';
import { DxSchedulerModule, DxSchedulerComponent, DxSchedulerTypes } from 'devextreme-angular/ui/scheduler';
import {
  Service, MovieData, TheatreData, Data,
} from './app.service';

@Pipe({ name: 'apply' })
export class ApplyPipe<TArgs, TReturn> implements PipeTransform {
  transform(func: ((...args: TArgs[]) => TReturn), ...args: TArgs[]): TReturn { return func(...args); }
}

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

let modulePrefix = '';
// @ts-ignore
if (window && window.config.packageConfigPaths) {
  modulePrefix = '/app';
}

@Component({
  selector: 'demo-app',
  templateUrl: `.${modulePrefix}/app.component.html`,
  styleUrls: [`.${modulePrefix}/app.component.css`],
  providers: [Service],
})
export class AppComponent {
  @ViewChild(DxSchedulerComponent, { static: false }) scheduler: DxSchedulerComponent;

  data: Data[];

  currentDate: Date = new Date(2021, 3, 27);

  moviesData: MovieData[];

  theatreData: TheatreData[];

  constructor(service: Service) {
    this.data = service.getData();
    this.moviesData = service.getMoviesData();
    this.theatreData = service.getTheatreData();
  }

  onAppointmentFormOpening = (data: DxSchedulerTypes.AppointmentFormOpeningEvent) => {
    const that = this;
    const form = data.form;
    let movieInfo = that.getMovieById(data.appointmentData.movieId) || {};
    let startDate = data.appointmentData.startDate;

    form.option('items', [{
      label: {
        text: 'Movie',
      },
      editorType: 'dxSelectBox',
      dataField: 'movieId',
      editorOptions: {
        items: that.moviesData,
        displayExpr: 'text',
        valueExpr: 'id',
        onValueChanged({ value }) {
          movieInfo = that.getMovieById(value);

          form.updateData('director', movieInfo.director);
          form.updateData('endDate', new Date((startDate as Date).getTime() + 60 * 1000 * movieInfo.duration));
        },
      },
    }, {
      label: {
        text: 'Director',
      },
      name: 'director',
      editorType: 'dxTextBox',
      editorOptions: {
        value: movieInfo.director,
        readOnly: true,
      },
    }, {
      dataField: 'startDate',
      editorType: 'dxDateBox',
      editorOptions: {
        width: '100%',
        type: 'datetime',
        onValueChanged({ value }) {
          form.updateData('endDate', new Date((value as Date).getTime() + 60 * 1000 * movieInfo.duration));
        },
      },
    }, {
      name: 'endDate',
      dataField: 'endDate',
      editorType: 'dxDateBox',
      editorOptions: {
        width: '100%',
        type: 'datetime',
        readOnly: true,
      },
    }, {
      dataField: 'price',
      editorType: 'dxRadioGroup',
      editorOptions: {
        dataSource: [5, 10, 15, 20],
        itemTemplate(itemData: string) {
          return `$${itemData}`;
        },
      },
    }]);
  };

  getMovieById = (id: string) => Query(this.moviesData).filter(['id', '=', id]).toArray()[0];
}

@NgModule({
  imports: [
    BrowserModule,
    DxSchedulerModule,
    DxTemplateModule,
  ],
  declarations: [AppComponent, ApplyPipe],
  bootstrap: [AppComponent],
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
