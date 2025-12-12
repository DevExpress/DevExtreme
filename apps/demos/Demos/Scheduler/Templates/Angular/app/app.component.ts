import {
  NgModule, Component, ViewChild, enableProdMode, Pipe, PipeTransform,
} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { query } from 'devextreme-angular/common/data';
import { DxSchedulerModule, DxSchedulerComponent } from 'devextreme-angular/ui/scheduler';
import { DxSelectBoxTypes } from 'devextreme-angular/ui/select-box';
import { DxFormTypes } from 'devextreme-angular/ui/form';
import { DxPopupTypes } from 'devextreme-angular/ui/popup';
import {
  Service, MovieData, TheatreData, Data,
} from './app.service';

type dxForm = NonNullable<DxFormTypes.InitializedEvent['component']>;

@Pipe({ name: 'apply' })
export class ApplyPipe<TArgs, TReturn> implements PipeTransform {
  transform(func: ((...args: TArgs[]) => TReturn), ...args: TArgs[]): TReturn { return func(...args); }
}

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

let modulePrefix = '';
// @ts-ignore
if (window && window.config?.packageConfigPaths) {
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

  currentDate: Date = new Date(2025, 3, 27);

  moviesData: MovieData[];

  theatreData: TheatreData[];

  views: string[] = ['day', 'week', 'timelineDay'];

  groups: string[] = ['theatreId'];

  formInstance: dxForm | null = null;

  currentSelectedMovie: MovieData | null = null;

  movieEditorOptions: DxSelectBoxTypes.Properties;

  priceEditorOptions: DxSelectBoxTypes.Properties;

  constructor(service: Service) {
    this.data = service.getData();
    this.moviesData = service.getMoviesData();
    this.theatreData = service.getTheatreData();

    this.movieEditorOptions = {
      items: this.moviesData,
      displayExpr: 'text',
      valueExpr: 'id',
      stylingMode: this.getEditorStylingMode(),
      onValueChanged: this.onMovieValueChanged,
      onContentReady: this.onCustomEditorContentReady,
    };

    this.priceEditorOptions = {
      items: [5, 10, 15, 20],
      displayExpr: this.priceDisplayExpr,
      stylingMode: this.getEditorStylingMode(),
      onContentReady: this.onCustomEditorContentReady,
    };
  }

  getMovieById = (id: number | undefined): MovieData | undefined => id
    ? query(this.moviesData).filter(['id', '=', id]).toArray()[0]
    : null;

  getEditorStylingMode = (): 'filled' | 'outlined' => {
    const isMaterialOrFluent = document.querySelector('.dx-theme-fluent, .dx-theme-material');
    return isMaterialOrFluent ? 'filled' : 'outlined';
  };

  priceDisplayExpr = (value: number): string => `$${value}`;

  colCountByScreen = { xs: 2 };

  onPopupOptionChanged = (e: DxPopupTypes.OptionChangedEvent): void => {
    if (e.fullName === 'toolbarItems' && e.value) {
      e.value.forEach((item, index) => {
        if (item.shortcut === 'done' || item.shortcut === 'cancel') {
          e.component.option(`toolbarItems[${index}].toolbar`, 'bottom');
        }
      });
    }
  };

  popupOptions: DxPopupTypes.Properties = {
    maxWidth: 440,
    onOptionChanged: this.onPopupOptionChanged,
  };

  updateEndDate = (movie: MovieData): void => {
    const form = this.formInstance;
    const formData = form.option('formData');
    const { startDate } = formData;

    if (startDate) {
      const newEndDate = new Date(startDate.getTime() + 60 * 1000 * movie.duration);
      form.updateData('endDate', newEndDate);
    }
  };

  onFormInitialized = (e: DxFormTypes.InitializedEvent): void => {
    const form = e.component;
    const formData = form.option('formData');

    this.formInstance = form;
    this.currentSelectedMovie = this.getMovieById(formData?.movieId);

    form.on('fieldDataChanged', (fieldEvent: DxFormTypes.FieldDataChangedEvent) => {
      if (fieldEvent.dataField === 'startDate') {
        const currentFormData = form.option('formData');
        const movie = this.getMovieById(currentFormData?.movieId);

        if (movie) {
          this.updateEndDate(movie);
        }
      }
    });
  };

  onMovieValueChanged = (e: DxSelectBoxTypes.ValueChangedEvent): void => {
    const form = this.formInstance!;
    const movie = this.getMovieById(e.value);
    this.currentSelectedMovie = movie;

    if (movie) {
      form.updateData('director', movie.director);
      this.updateEndDate(movie);
    }
  };

  onCustomEditorContentReady = (e: DxSelectBoxTypes.ContentReadyEvent): void => {
    e.component.option('stylingMode', this.getEditorStylingMode());
  };
}

@NgModule({
  imports: [
    BrowserModule,
    DxSchedulerModule,
  ],
  declarations: [AppComponent, ApplyPipe],
  bootstrap: [AppComponent],
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
