import React, { useCallback, useRef } from 'react';
import Scheduler, {
  Editing,
  Resource,
  Form as SchedulerForm,
  SimpleItem,
  GroupItem,
} from 'devextreme-react/scheduler';
import { query } from 'devextreme-react/common/data';
import Appointment from './Appointment.js';
import AppointmentTooltip from './AppointmentTooltip.js';
import MovieInfoForm from './MovieInfoContainer.js';
import { data, moviesData, theatreData } from './data.js';

const currentDate = new Date(2025, 3, 27);
const views = ['day', 'week', 'timelineDay'];
const groups = ['theatreId'];
const getMovieById = (id) => query(moviesData).filter(['id', id]).toArray()[0];
const getEditorStylingMode = () => {
  const isMaterialOrFluent = document.querySelector('.dx-theme-fluent, .dx-theme-material');
  return isMaterialOrFluent ? 'filled' : 'outlined';
};
const priceDisplayExpr = (value) => `$${value}`;
const updateEndDate = (form, movie) => {
  const formData = form.option('formData');
  const { startDate } = formData;
  if (startDate && movie?.duration) {
    const newEndDate = new Date(startDate.getTime() + 60 * 1000 * movie.duration);
    form.updateData('endDate', newEndDate);
  }
};
const App = () => {
  const formInstanceRef = useRef(null);
  const onMovieValueChanged = useCallback((e) => {
    const movie = getMovieById(e.value);
    if (formInstanceRef.current && movie) {
      formInstanceRef.current.updateData('director', movie.director);
      updateEndDate(formInstanceRef.current, movie);
    }
  }, []);
  const onMovieEditorContentReady = useCallback((e) => {
    e.component.option('stylingMode', getEditorStylingMode());
  }, []);
  const onPriceEditorContentReady = useCallback((e) => {
    e.component.option('stylingMode', getEditorStylingMode());
  }, []);
  const onPopupOptionChanged = useCallback((e) => {
    if (e.fullName === 'toolbarItems' && e.value) {
      e.value.forEach((item, index) => {
        if (item.shortcut === 'done' || item.shortcut === 'cancel') {
          e.component.option(`toolbarItems[${index}].toolbar`, 'bottom');
        }
      });
    }
  }, []);
  const onFormInitialized = useCallback((e) => {
    const form = e.component;
    formInstanceRef.current = form;
    form.on('fieldDataChanged', (fieldEvent) => {
      if (fieldEvent.dataField === 'startDate') {
        const currentFormData = form.option('formData');
        if (currentFormData.movieId) {
          const movie = getMovieById(currentFormData.movieId);
          if (movie) {
            updateEndDate(form, movie);
          }
        }
      }
    });
  }, []);
  const movieInfoFormRender = useCallback(
    () => <MovieInfoForm formInstanceRef={formInstanceRef} />,
    [],
  );
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
        popup={{
          maxWidth: 440,
          onOptionChanged: onPopupOptionChanged,
        }}
      >
        <SchedulerForm onInitialized={onFormInitialized}>
          <SimpleItem render={movieInfoFormRender} />

          <GroupItem
            itemType="group"
            colCount={2}
            colCountByScreen={{ xs: 2 }}
          >
            <SimpleItem
              dataField="movieId"
              editorType="dxSelectBox"
              label={{ text: 'Movie' }}
              colSpan={1}
              editorOptions={{
                items: moviesData,
                displayExpr: 'text',
                valueExpr: 'id',
                stylingMode: getEditorStylingMode(),
                onValueChanged: onMovieValueChanged,
                onContentReady: onMovieEditorContentReady,
              }}
            />

            <SimpleItem
              dataField="price"
              editorType="dxSelectBox"
              label={{ text: 'Price' }}
              colSpan={1}
              editorOptions={{
                items: [5, 10, 15, 20],
                displayExpr: priceDisplayExpr,
                stylingMode: getEditorStylingMode(),
                onContentReady: onPriceEditorContentReady,
              }}
            />
          </GroupItem>

          <GroupItem
            itemType="group"
            name="startDateGroup"
          />

          {/* @ts-expect-error - disabled is a hidden feature not in typings */}
          <GroupItem
            itemType="group"
            name="endDateGroup"
            disabled={true}
          />
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
