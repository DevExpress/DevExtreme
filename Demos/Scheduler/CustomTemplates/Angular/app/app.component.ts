import {
  NgModule, Component, ViewChild, enableProdMode,
} from '@angular/core';
import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxSchedulerModule, DxSchedulerComponent, DxTemplateModule } from 'devextreme-angular';
import Query from 'devextreme/data/query';
import {
  Service, MovieData, TheatreData, Data,
} from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  templateUrl: 'app/app.component.html',
  styleUrls: ['app/app.component.css'],
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

  onAppointmentFormOpening(data) {
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
        onValueChanged(args) {
          movieInfo = that.getMovieById(args.value);

          form.updateData('director', movieInfo.director);
          form.updateData('endDate', new Date(startDate.getTime() + 60 * 1000 * movieInfo.duration));
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
        onValueChanged(args) {
          startDate = args.value;
          form.updateData('endDate', new Date(startDate.getTime() + 60 * 1000 * movieInfo.duration));
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
        itemTemplate(itemData) {
          return `$${itemData}`;
        },
      },
    }]);
  }

  getDataObj(objData) {
    for (let i = 0; i < this.data.length; i++) {
      if (this.data[i].startDate.getTime() === objData.startDate.getTime() && this.data[i].theatreId === objData.theatreId) { return this.data[i]; }
    }
    return null;
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
    DxTemplateModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
