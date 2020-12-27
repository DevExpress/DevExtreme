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

<script>
import DxScheduler, { DxResource } from 'devextreme-vue/scheduler';
import AppointmentTemplate from './AppointmentTemplate.vue';
import AppointmentTooltipTemplate from './AppointmentTooltipTemplate.vue';

import { data, moviesData, theatreData } from './data.js';
import Query from 'devextreme/data/query';

const getMovieById = function(resourceId) {
  return Query(moviesData)
    .filter('id', resourceId)
    .toArray()[0];
};

export default {
  components: {
    DxScheduler,
    DxResource,
    AppointmentTemplate,
    AppointmentTooltipTemplate
  },
  data() {
    return {
      views: ['day', 'week', 'timelineDay'],
      groups: ['theatreId'],
      scheduler: null,
      currentDate: new Date(2021, 4, 25),
      dataSource: data,
      moviesData: moviesData,
      theatreData: theatreData,
      editing: { allowAdding: false }
    };
  },
  methods: {
    onContentReady(e) {
      this.scheduler = e.component;
    },
    onAppointmentFormOpening(data) {
      let form = data.form,
        movieInfo = getMovieById(data.appointmentData.movieId) || {},
        startDate = data.appointmentData.startDate;

      form.option('items', [{
        label: {
          text: 'Movie'
        },
        editorType: 'dxSelectBox',
        dataField: 'movieId',
        editorOptions: {
          items: moviesData,
          displayExpr: 'text',
          valueExpr: 'id',
          onValueChanged: function(args) {
            movieInfo = getMovieById(args.value);

            form.updateData('director', movieInfo.director);
            form.updateData('endDate', new Date(startDate.getTime() + 60 * 1000 * movieInfo.duration));
          }
        },
      }, {
        label: {
          text: 'Director'
        },
        name: 'director',
        editorType: 'dxTextBox',
        editorOptions: {
          value: movieInfo.director,
          readOnly: true
        }
      }, {
        dataField: 'startDate',
        editorType: 'dxDateBox',
        editorOptions: {
          width: '100%',
          type: 'datetime',
          onValueChanged: function(args) {
            startDate = args.value;
            form.updateData('endDate', new Date(startDate.getTime() + 60 * 1000 * movieInfo.duration));
          }
        }
      }, {
        name: 'endDate',
        dataField: 'endDate',
        editorType: 'dxDateBox',
        editorOptions: {
          width: '100%',
          type: 'datetime',
          readOnly: true
        }
      }, {
        dataField: 'price',
        editorType: 'dxRadioGroup',
        editorOptions: {
          dataSource: [5, 10, 15, 20],
          itemTemplate: function(itemData) {
            return '$'.concat(itemData);
          }
        }
      }
      ]);
    }
  },
};
</script>
