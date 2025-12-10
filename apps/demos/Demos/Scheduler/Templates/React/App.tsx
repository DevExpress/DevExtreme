import React, { useCallback, useMemo, useRef } from 'react';
import Scheduler, {
  Editing,
  Resource,
  Form as SchedulerForm,
  Item,
  Label,
  type SchedulerTypes,
} from 'devextreme-react/scheduler';
import { query } from 'devextreme-react/common/data';
import { type SelectBoxTypes } from 'devextreme-react/select-box';
import { type FormTypes } from 'devextreme-react/form';
import { type PopupTypes } from 'devextreme-react/popup';
import Appointment from './Appointment.tsx';
import AppointmentTooltip from './AppointmentTooltip.tsx';
import MovieInfoContainer from './MovieInfoContainer.tsx';
import {
  data, moviesData, theatreData, type MovieResource,
} from './data.ts';

type dxForm = NonNullable<FormTypes.InitializedEvent['component']>;

const currentDate = new Date(2025, 3, 27);
const views: SchedulerTypes.ViewType[] = ['day', 'week', 'timelineDay'];
const groups = ['theatreId'];

const getMovieById = (id: number | undefined): any => id
  ? query(moviesData).filter(['id', '=', id]).toArray()[0]
  : null;

const getEditorStylingMode = (): 'filled' | 'outlined' => {
  const isMaterialOrFluent = document.querySelector('.dx-theme-fluent, .dx-theme-material');
  return isMaterialOrFluent ? 'filled' : 'outlined';
};

const priceDisplayExpr = (value: number): string => `$${value}`;

const colCountByScreen = { xs: 2 };

const App = () => {
  const formInstanceRef = useRef<dxForm | null>(null);

  const onPopupOptionChanged = useCallback((e: PopupTypes.OptionChangedEvent) => {
    if (e.fullName === 'toolbarItems' && e.value) {
      e.value.forEach((item: any, index: number) => {
        if (item.shortcut === 'done' || item.shortcut === 'cancel') {
          e.component.option(`toolbarItems[${index}].toolbar`, 'bottom');
        }
      });
    }
  }, []);

  const popupOptions = useMemo(() => ({
    maxWidth: 440,
    onOptionChanged: onPopupOptionChanged,
  }), [onPopupOptionChanged]);

  const updateEndDate = useCallback((movie: MovieResource): void => {
    const form = formInstanceRef.current;
    const formData = form.option('formData');
    const { startDate } = formData;

    if (startDate) {
      const newEndDate = new Date(startDate.getTime() + 60 * 1000 * movie.duration);
      form.updateData('endDate', newEndDate);
    }
  }, []);

  const onFormInitialized = useCallback((e: FormTypes.InitializedEvent) => {
    const form = e.component;
    formInstanceRef.current = form;

    form.on('fieldDataChanged', (fieldEvent: FormTypes.FieldDataChangedEvent) => {
      if (fieldEvent.dataField === 'startDate') {
        const currentFormData = form.option('formData');
        const movie = getMovieById(currentFormData.movieId);

        if (movie) {
          updateEndDate(movie);
        }
      }
    });
  }, [updateEndDate]);

  const onMovieValueChanged = useCallback((e: SelectBoxTypes.ValueChangedEvent) => {
    const movie = getMovieById(e.value);

    if (movie) {
      formInstanceRef.current.updateData('director', movie.director);
      updateEndDate(movie);
    }
  }, [updateEndDate]);

  const movieInfoContainerRender = useCallback(
    () => <MovieInfoContainer formInstanceRef={formInstanceRef} />,
    [],
  );

  const onCustomEditorContentReady = useCallback((e: SelectBoxTypes.ContentReadyEvent) => {
    e.component.option('stylingMode', getEditorStylingMode());
  }, []);

  const movieEditorOptions = useMemo(() => ({
    items: moviesData,
    displayExpr: 'text',
    valueExpr: 'id',
    stylingMode: getEditorStylingMode(),
    onValueChanged: onMovieValueChanged,
    onContentReady: onCustomEditorContentReady,
  }), [onMovieValueChanged, onCustomEditorContentReady]);

  const priceEditorOptions = useMemo(() => ({
    items: [5, 10, 15, 20],
    displayExpr: priceDisplayExpr,
    stylingMode: getEditorStylingMode(),
    onContentReady: onCustomEditorContentReady,
  }), [onCustomEditorContentReady]);

  return (
    <Scheduler
      timeZone="America/Los_Angeles"
      dataSource={data}
      views={views}
      defaultCurrentView="day"
      defaultCurrentDate={currentDate}
      groups={groups}
      height={600}
      firstDayOfWeek={0}
      startDayHour={9}
      endDayHour={23}
      showAllDayPanel={false}
      crossScrollingEnabled={true}
      cellDuration={20}
      appointmentComponent={Appointment}
      appointmentTooltipComponent={AppointmentTooltip}
    >
      <Editing
        allowAdding={false}
        popup={popupOptions}
      >
        <SchedulerForm onInitialized={onFormInitialized}>
          <Item render={movieInfoContainerRender} />

          <Item itemType="group" colCount={2} colCountByScreen={colCountByScreen}>
            <Item
              dataField="movieId"
              editorType="dxSelectBox"
              colSpan={1}
              editorOptions={movieEditorOptions}
            >
              <Label>Movie</Label>
            </Item>

            <Item
              dataField="price"
              editorType="dxSelectBox"
              colSpan={1}
              editorOptions={priceEditorOptions}
            >
              <Label>Price</Label>
            </Item>
          </Item>

          <Item itemType="group" name="startDateGroup" />

          <Item itemType="group" name="endDateGroup" disabled={true} />
        </SchedulerForm>
      </Editing>

      <Resource
        dataSource={moviesData}
        fieldExpr="movieId"
        useColorAsDefault={true}
      />
      <Resource
        dataSource={theatreData}
        fieldExpr="theatreId"
      />
    </Scheduler>
  );
};

export default App;
