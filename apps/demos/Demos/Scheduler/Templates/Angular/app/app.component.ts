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

  formInstance: dxForm | null = null;

  currentSelectedMovie: MovieData | null = null;

  constructor(service: Service) {
    this.data = service.getData();
    this.moviesData = service.getMoviesData();
    this.theatreData = service.getTheatreData();
  }

  getMovieById = (id: number): MovieData | undefined => query(this.moviesData).filter(['id', '=', id]).toArray()[0];

  getEditorStylingMode = (): 'filled' | 'outlined' => {
    const isMaterialOrFluent = document.querySelector('.dx-theme-fluent, .dx-theme-material');
    return isMaterialOrFluent ? 'filled' : 'outlined';
  };

  priceDisplayExpr = (value: number): string => `$${value}`;

  onMovieValueChanged = (e: DxSelectBoxTypes.ValueChangedEvent): void => {
    const movie = this.getMovieById(e.value);
    this.currentSelectedMovie = movie;

    if (this.formInstance && movie) {
      this.formInstance.updateData('director', movie.director);
      this.updateEndDate(this.formInstance, movie);
    }
  };

  onMovieEditorContentReady = (e: DxSelectBoxTypes.ContentReadyEvent): void => {
    e.component.option('stylingMode', this.getEditorStylingMode());
  };

  onPriceEditorContentReady = (e: DxSelectBoxTypes.ContentReadyEvent): void => {
    e.component.option('stylingMode', this.getEditorStylingMode());
  };

  onPopupOptionChanged = (e: DxPopupTypes.OptionChangedEvent): void => {
    if (e.fullName === 'toolbarItems' && e.value) {
      e.value.forEach((item, index) => {
        if (item.shortcut === 'done' || item.shortcut === 'cancel') {
          e.component.option(`toolbarItems[${index}].toolbar`, 'bottom');
        }
      });
    }
  };

  updateEndDate = (form: dxForm, movie: MovieData): void => {
    const formData = form.option('formData');
    const { startDate } = formData;
    if (startDate && movie?.duration) {
      const newEndDate = new Date(startDate.getTime() + 60 * 1000 * movie.duration);
      form.updateData('endDate', newEndDate);
    }
  };

  onFormInitialized = (e: DxFormTypes.InitializedEvent): void => {
    const form = e.component;
    this.formInstance = form;

    const formData = form.option('formData');
    if (formData?.movieId) {
      const movie = this.getMovieById(formData.movieId);
      this.currentSelectedMovie = movie;
    } else {
      this.currentSelectedMovie = null;
    }

    form.on('fieldDataChanged', (fieldEvent: DxFormTypes.FieldDataChangedEvent) => {
      if (fieldEvent.dataField === 'startDate') {
        const currentFormData = form.option('formData');
        if (currentFormData.movieId) {
          const movie = this.getMovieById(currentFormData.movieId);
          if (movie) {
            this.updateEndDate(form, movie);
          }
        }
      }
    });
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
