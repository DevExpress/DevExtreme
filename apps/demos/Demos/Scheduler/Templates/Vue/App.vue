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
        :popup="{
          maxWidth: 440,
          onOptionChanged: onPopupOptionChanged
        }"
      >
        <DxSchedulerForm :on-initialized="onFormInitialized">
          <DxItem template="movie-info-form-template"/>

          <DxItem
            :col-count="2"
            :col-count-by-screen="{ xs: 2 }"
            item-type="group"
          >
            <DxItem
              :col-span="1"
              :label="{ text: 'Movie' }"
              :editor-options="{
                items: moviesData,
                displayExpr: 'text',
                valueExpr: 'id',
                stylingMode: getEditorStylingMode(),
                onValueChanged: onMovieValueChanged,
                onContentReady: onMovieEditorContentReady
              }"
              data-field="movieId"
              editor-type="dxSelectBox"
            />

            <DxItem
              :col-span="1"
              :label="{ text: 'Price' }"
              :editor-options="{
                items: [5, 10, 15, 20],
                displayExpr: priceDisplayExpr,
                stylingMode: getEditorStylingMode(),
                onContentReady: onPriceEditorContentReady
              }"
              data-field="price"
              editor-type="dxSelectBox"
            />
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
  DxForm as DxSchedulerForm,
  type DxSchedulerTypes,
} from 'devextreme-vue/scheduler';
import DxForm, { DxItem, type DxFormTypes } from 'devextreme-vue/form';
import { type DxSelectBoxTypes } from 'devextreme-vue/select-box';
import type { OptionChangedEvent as PopupOptionChangedEvent } from 'devextreme/ui/popup';
import query from 'devextreme/data/query';
import type { MovieResource } from './data.ts';
import AppointmentTemplate from './AppointmentTemplate.vue';
import AppointmentTooltipTemplate from './AppointmentTooltipTemplate.vue';
import MovieInfoContainer from './MovieInfoContainer.vue';
import { data, moviesData, theatreData } from './data.ts';

const views = ['day', 'week', 'timelineDay'];
const groups = ['theatreId'];
const scheduler = ref<DxScheduler['instance']>();
const currentDate = new Date(2025, 3, 27);
const dataSource = data;

const currentMovie = ref<MovieResource | null | undefined>(null);
const formInstance = ref<DxForm['instance'] | null>(null);

const getMovieById = (resourceId: number): MovieResource | undefined =>
  query(moviesData)
    .filter(['id', '=', resourceId])
    .toArray()[0];

const getEditorStylingMode = (): 'filled' | 'outlined' => {
  const isMaterialOrFluent = document.querySelector('.dx-theme-fluent, .dx-theme-material');
  return isMaterialOrFluent ? 'filled' : 'outlined';
};

const priceDisplayExpr = (value: number): string => `$${value}`;

const updateEndDate = (form: NonNullable<DxForm['instance']>, movie: MovieResource): void => {
  const formData = form.option('formData');
  const { startDate } = formData;
  if (startDate && movie?.duration) {
    const newEndDate = new Date(startDate.getTime() + 60 * 1000 * movie.duration);
    form.updateData('endDate', newEndDate);
  }
};

const onMovieValueChanged = (e: DxSelectBoxTypes.ValueChangedEvent): void => {
  const movie = getMovieById(e.value);
  currentMovie.value = movie;

  if (formInstance.value && movie) {
    formInstance.value.updateData('director', movie.director);
    updateEndDate(formInstance.value, movie);
  }
};

const onMovieEditorContentReady = (e: DxSelectBoxTypes.ContentReadyEvent): void => {
  e.component.option('stylingMode', getEditorStylingMode());
};

const onPriceEditorContentReady = (e: DxSelectBoxTypes.ContentReadyEvent): void => {
  e.component.option('stylingMode', getEditorStylingMode());
};

const onPopupOptionChanged = (e: PopupOptionChangedEvent): void => {
  if (e.fullName === 'toolbarItems' && e.value) {
    e.value.forEach((item: any, index: number) => {
      if (item.shortcut === 'done' || item.shortcut === 'cancel') {
        e.component.option(`toolbarItems[${index}].toolbar`, 'bottom');
      }
    });
  }
};

const onFormInitialized = (e: DxFormTypes.InitializedEvent): void => {
  const form = e.component!;
  formInstance.value = form;

  const formData = form.option('formData');
  if (formData?.movieId) {
    const movie = getMovieById(formData.movieId);
    currentMovie.value = movie;
  } else {
    currentMovie.value = null;
  }

  form.on('fieldDataChanged', (fieldEvent: DxFormTypes.FieldDataChangedEvent) => {
    if (fieldEvent.dataField === 'startDate') {
      const movie = getMovieById(form.option('formData').movieId);
      if (movie) {
        updateEndDate(form, movie);
      }
    }
  });
};

function onContentReady(e: DxSchedulerTypes.ContentReadyEvent) {
  scheduler.value = e.component;
}
</script>
