import {
  NgModule, Component, ViewChild, enableProdMode,
} from '@angular/core';
import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';

import { DxChartModule, DxChartComponent } from 'devextreme-angular';
import DataSource from 'devextreme/data/data_source';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  templateUrl: 'app/app.component.html',
  styleUrls: ['app/app.component.css'],
})
export class AppComponent {
  @ViewChild(DxChartComponent, { static: false }) component: DxChartComponent;

  private _visualRange: any = {};

  HALFDAY = 43200000;

  packetsLock = 0;

  chartDataSource: any;

  bounds: any;

  constructor(private httpClient: HttpClient) {
    this.chartDataSource = new DataSource({
      store: [],
      sort: 'date',
      paginate: false,
    });

    this.bounds = {
      startValue: new Date(2017, 0, 1),
      endValue: new Date(2017, 11, 31),
    };

    this._visualRange = {
      startValue: new Date(2017, 3, 1),
      length: {
        weeks: 2,
      },
    };
  }

  get currentVisualRange(): any {
    return this._visualRange;
  }

  set currentVisualRange(range: any) {
    this._visualRange.startValue = range.startValue;
    this._visualRange.endValue = range.endValue;
    this.onVisualRangeChanged();
  }

  onVisualRangeChanged() {
    const items = this.component.instance.getDataSource().items();
    if (!items.length
            || items[0].date - this._visualRange.startValue >= this.HALFDAY
            || this._visualRange.endValue - items[items.length - 1].date >= this.HALFDAY) {
      this.uploadDataByVisualRange();
    }
  }

  uploadDataByVisualRange() {
    const dataSource = this.component.instance.getDataSource();
    const storage = dataSource.items();
    const ajaxArgs = {
      startVisible: this.getDateString(this._visualRange.startValue),
      endVisible: this.getDateString(this._visualRange.endValue),
      startBound: this.getDateString(storage.length ? storage[0].date : null),
      endBound: this.getDateString(storage.length
        ? storage[storage.length - 1].date : null),
    };

    if (ajaxArgs.startVisible !== ajaxArgs.startBound
            && ajaxArgs.endVisible !== ajaxArgs.endBound && !this.packetsLock) {
      this.packetsLock++;
      this.component.instance.showLoadingIndicator();

      this.getDataFrame(ajaxArgs)
        .then((dataFrame: any) => {
          this.packetsLock--;
          dataFrame = dataFrame.map((i) => ({
            date: new Date(i.Date),
            minTemp: i.MinTemp,
            maxTemp: i.MaxTemp,
          }));

          const componentStorage = dataSource.store();
          dataFrame.forEach((item) => componentStorage.insert(item));
          dataSource.reload();

          this.onVisualRangeChanged();
        })
        .catch((error) => {
          this.packetsLock--;
          dataSource.reload();
        });
    }
  }

  getDataFrame(args: any) {
    let params = '?';

    params += `startVisible=${args.startVisible}`;
    params += `&endVisible=${args.endVisible}`;
    params += `&startBound=${args.startBound}`;
    params += `&endBound=${args.endBound}`;

    return lastValueFrom(
      this.httpClient.get(`https://js.devexpress.com/Demos/WidgetsGallery/data/temperatureData${params}`),
    );
  }

  getDateString(dateTime: Date) {
    return dateTime ? dateTime.toLocaleDateString('en-US') : '';
  }
}

@NgModule({
  imports: [
    BrowserModule,
    BrowserTransferStateModule,
    DxChartModule,
    HttpClientModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
