import {
  Component,
  enableProdMode,
  Pipe,
  type PipeTransform,
  inject,
  signal,
} from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { formatDate } from 'devextreme-angular/common/core/localization';
import { query } from 'devextreme-angular/common/data';
import themes from 'devextreme/ui/themes';
import { DxSchedulerModule } from 'devextreme-angular/ui/scheduler';
import { DxSelectBoxTypes } from 'devextreme-angular/ui/select-box';
import { DxFormTypes } from 'devextreme-angular/ui/form';
import { DxPopupTypes } from 'devextreme-angular/ui/popup';

import { Service, type MovieData } from './app.service';

type dxForm = NonNullable<DxFormTypes.InitializedEvent['component']>;

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
  imports: [
    DxSchedulerModule,
    ApplyPipe,
  ],
})
export class AppComponent {
  private readonly service = inject(Service);

  readonly formatDate = formatDate;

  readonly data = this.service.getData();

  readonly currentDate = new Date(2025, 3, 27);

  readonly moviesData = this.service.getMoviesData();

  readonly theatreData = this.service.getTheatreData();

  readonly views = ['day', 'week', 'timelineDay'];

  readonly groups = ['theatreId'];

  private formInstance: dxForm | null = null;

  readonly currentSelectedMovie = signal<MovieData | null>(null);

  readonly getMovieById = (id: number | undefined): MovieData | null => id
    ? query(this.moviesData).filter(['id', '=', id]).toArray()[0] ?? null
    : null;

  private readonly getEditorStylingMode = (): 'filled' | 'outlined' => (
    themes.current().startsWith('generic') ? 'outlined' : 'filled'
  );

  private readonly priceDisplayExpr = (value: number): string => `$${value}`;

  readonly colCountByScreen = { xs: 2 };

  private readonly onPopupOptionChanged = (e: DxPopupTypes.OptionChangedEvent): void => {
    if (e.fullName === 'toolbarItems' && e.value) {
      e.value.forEach((item, index) => {
        if (item.shortcut === 'done' || item.shortcut === 'cancel') {
          e.component.option(`toolbarItems[${index}].toolbar`, 'bottom');
        }
      });
    }
  };

  readonly popupOptions: DxPopupTypes.Properties = {
    maxWidth: 440,
    onOptionChanged: this.onPopupOptionChanged,
  };

  private readonly updateEndDate = (movie: MovieData): void => {
    const form = this.formInstance;
    const formData = form.option('formData');
    const { startDate } = formData;

    if (startDate) {
      const newEndDate = new Date(startDate.getTime() + 60 * 1000 * movie.duration);
      form.updateData('endDate', newEndDate);
    }
  };

  readonly onFormInitialized = (e: DxFormTypes.InitializedEvent): void => {
    const form = e.component;
    const formData = form.option('formData');

    this.formInstance = form;
    this.currentSelectedMovie.set(this.getMovieById(formData?.movieId));

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

  private readonly onMovieValueChanged = (e: DxSelectBoxTypes.ValueChangedEvent): void => {
    const form = this.formInstance;
    const movie = this.getMovieById(e.value);
    this.currentSelectedMovie.set(movie);

    if (movie) {
      form.updateData('director', movie.director);
      this.updateEndDate(movie);
    }
  };

  private readonly onCustomEditorContentReady = (e: DxSelectBoxTypes.ContentReadyEvent): void => {
    e.component.option('stylingMode', this.getEditorStylingMode());
  };

  readonly movieEditorOptions: DxSelectBoxTypes.Properties = {
    items: this.moviesData,
    displayExpr: 'text',
    valueExpr: 'id',
    stylingMode: this.getEditorStylingMode(),
    onValueChanged: this.onMovieValueChanged,
    onContentReady: this.onCustomEditorContentReady,
  };

  readonly priceEditorOptions: DxSelectBoxTypes.Properties = {
    items: [5, 10, 15, 20],
    displayExpr: this.priceDisplayExpr,
    stylingMode: this.getEditorStylingMode(),
    onContentReady: this.onCustomEditorContentReady,
  };
}

bootstrapApplication(AppComponent);
