<template>
  <div>
    <DxScheduler
      time-zone="America/Los_Angeles"
      :data-source="dataSource"
      :views="views"
      :current-date="currentDate"
      :height="600"
      :groups="groups"

      :first-day-of-week="0"
      :start-day-hour="9"
      :end-day-hour="23"
      :show-all-day-panel="false"
      :cross-scrolling-enabled="true"
      :cell-duration="20"

      :on-content-ready="onContentReady"

      appointment-template="AppointmentTemplateSlot"
      appointment-tooltip-template="AppointmentTooltipTemplateSlot"

      current-view="day"
    >
      <DxEditing
        :allow-adding="false"
        :popup="popupOptions"
      >
        <DxSchedulerForm :on-initialized="onFormInitialized">
          <DxItem template="movie-info-form-template"/>

          <DxItem
            :col-count="2"
            :col-count-by-screen="colCountByScreen"
            item-type="group"
          >
            <DxItem
              :col-span="1"
              :editor-options="movieEditorOptions"
              data-field="movieId"
              editor-type="dxSelectBox"
            >
              <DxLabel>Movie</DxLabel>
            </DxItem>

            <DxItem
              :col-span="1"
              :editor-options="priceEditorOptions"
              data-field="price"
              editor-type="dxSelectBox"
            >
              <DxLabel>Price</DxLabel>
            </DxItem>
          </DxItem>

          <DxItem name="startDateGroup"/>

          <DxItem
            :disabled="true"
            name="endDateGroup"
          />
        </DxSchedulerForm>
      </DxEditing>
      <template #movie-info-form-template>
        <MovieInfoContainer :movie="currentMovie"/>
      </template>

      <DxResource
        :use-color-as-default="true"
        :data-source="moviesData"
        field-expr="movieId"
      />
      <DxResource
        :data-source="theatreData"
        field-expr="theatreId"
      />

      <template #AppointmentTemplateSlot="{ data }">
        <AppointmentTemplate
          :scheduler="scheduler"
          :template-model="data"
        />
      </template>
      <template #AppointmentTooltipTemplateSlot="{ data }">
        <AppointmentTooltipTemplate
          :scheduler="scheduler"
          :template-tooltip-model="data"
        />
      </template>
    </DxScheduler>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import DxScheduler, {
  DxResource,
  DxEditing,
  DxLabel,
  DxItem,
  DxForm as DxSchedulerForm,
  type DxSchedulerTypes,
} from 'devextreme-vue/scheduler';
import { type DxFormTypes } from 'devextreme-vue/form';
import { type DxSelectBoxTypes } from 'devextreme-vue/select-box';
import { type DxPopupTypes } from 'devextreme-vue/popup';
import { query } from 'devextreme-vue/common/data';
import type { MovieResource } from './data.ts';
import AppointmentTemplate from './AppointmentTemplate.vue';
import AppointmentTooltipTemplate from './AppointmentTooltipTemplate.vue';
import MovieInfoContainer from './MovieInfoContainer.vue';
import { data, moviesData, theatreData } from './data.ts';

type dxForm = NonNullable<DxFormTypes.InitializedEvent['component']>;

const views = ['day', 'week', 'timelineDay'];
const groups = ['theatreId'];
const scheduler = ref<DxScheduler['instance']>();
const currentDate = new Date(2025, 3, 27);
const dataSource = data;

const currentMovie = ref<MovieResource | null | undefined>(null);
const formInstance = ref<dxForm | null>(null);

const onContentReady = (e: DxSchedulerTypes.ContentReadyEvent) => {
  scheduler.value = e.component;
};

const getMovieById = (resourceId: number): MovieResource | undefined =>
  query(moviesData)
    .filter(['id', '=', resourceId])
    .toArray()[0];

const getEditorStylingMode = (): 'filled' | 'outlined' => {
  const isMaterialOrFluent = document.querySelector('.dx-theme-fluent, .dx-theme-material');
  return isMaterialOrFluent ? 'filled' : 'outlined';
};

const priceDisplayExpr = (value: number): string => `$${value}`;

const colCountByScreen = { xs: 2 };

const onPopupOptionChanged = (e: DxPopupTypes.OptionChangedEvent): void => {
  if (e.fullName === 'toolbarItems' && e.value) {
    e.value.forEach((item: any, index: number) => {
      if (item.shortcut === 'done' || item.shortcut === 'cancel') {
        e.component.option(`toolbarItems[${index}].toolbar`, 'bottom');
      }
    });
  }
};

const popupOptions = {
  maxWidth: 440,
  onOptionChanged: onPopupOptionChanged,
};

const updateEndDate = (movie: MovieResource): void => {
  const form = formInstance.value!;
  const formData = form.option('formData');
  const { startDate } = formData;

  if (startDate) {
    const newEndDate = new Date(startDate.getTime() + 60 * 1000 * movie.duration);
    form.updateData('endDate', newEndDate);
  }
};

const onFormInitialized = (e: DxFormTypes.InitializedEvent): void => {
  const form = e.component!;
  const formData = form.option('formData');

  formInstance.value = form;
  currentMovie.value = formData?.movieId ? getMovieById(formData.movieId) : null;

  form.on('fieldDataChanged', (fieldEvent: DxFormTypes.FieldDataChangedEvent) => {
    if (fieldEvent.dataField === 'startDate') {
      const movie = getMovieById(form.option('formData').movieId);

      if (movie) {
        updateEndDate(movie);
      }
    }
  });
};

const onMovieValueChanged = (e: DxSelectBoxTypes.ValueChangedEvent): void => {
  const form = formInstance.value!;
  const movie = getMovieById(e.value);
  currentMovie.value = movie;

  if (movie) {
    form.updateData('director', movie.director);
    updateEndDate(movie);
  }
};

const onCustomEditorContentReady = (e: DxSelectBoxTypes.ContentReadyEvent): void => {
  e.component.option('stylingMode', getEditorStylingMode());
};

const movieEditorOptions = {
  items: moviesData,
  displayExpr: 'text',
  valueExpr: 'id',
  stylingMode: getEditorStylingMode(),
  onValueChanged: onMovieValueChanged,
  onContentReady: onCustomEditorContentReady,
};

const priceEditorOptions = {
  items: [5, 10, 15, 20],
  displayExpr: priceDisplayExpr,
  stylingMode: getEditorStylingMode(),
  onContentReady: onCustomEditorContentReady,
};

</script>
