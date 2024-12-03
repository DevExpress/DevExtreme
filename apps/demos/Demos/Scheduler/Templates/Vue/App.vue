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
      :editing="editing"

      :on-content-ready="onContentReady"
      :on-appointment-form-opening="onAppointmentFormOpening"

      appointment-template="AppointmentTemplateSlot"
      appointment-tooltip-template="AppointmentTooltipTemplateSlot"

      current-view="day"
    >
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
import DxScheduler, { DxResource, DxSchedulerTypes } from 'devextreme-vue/scheduler';
import Query from 'devextreme/data/query';
import AppointmentTemplate from './AppointmentTemplate.vue';
import AppointmentTooltipTemplate from './AppointmentTooltipTemplate.vue';
import { data, moviesData, theatreData } from './data.ts';

const views = ['day', 'week', 'timelineDay'];
const groups = ['theatreId'];
const scheduler = ref<DxScheduler['instance']>(null);
const currentDate = new Date(2021, 3, 27);
const dataSource = data;
const editing = { allowAdding: false };

function onContentReady(e: DxSchedulerTypes.ContentReadyEvent) {
  scheduler.value = e.component;
}
function onAppointmentFormOpening(e: DxSchedulerTypes.AppointmentFormOpeningEvent) {
  const { form } = e;
  let movieInfo = getMovieById(e.appointmentData.movieId) || {};
  let startDate = e.appointmentData.startDate as Date;

  form.option('items', [{
    label: {
      text: 'Movie',
    },
    editorType: 'dxSelectBox',
    dataField: 'movieId',
    editorOptions: {
      items: moviesData,
      displayExpr: 'text',
      valueExpr: 'id',
      onValueChanged(args) {
        movieInfo = getMovieById(args.value);

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
        startDate = args.value as Date;
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
        return '$'.concat(itemData);
      },
    },
  },
  ]);
}
const getMovieById = function(resourceId) {
  return Query(moviesData)
    .filter(['id', resourceId])
    .toArray()[0];
};
</script>
