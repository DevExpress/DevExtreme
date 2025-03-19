<template>
  <example-block title="dxScheduler with Custom Templates">
    <div>Click on next or previous week to reproduce the performance issue</div>
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
        :on-initialized="onContentReady"
        appointment-template="AppointmentTemplateSlot"
        appointment-tooltip-template="AppointmentTooltipTemplateSlot"
        current-view="week"
      >
        <DxResource
          :use-color-as-default="true"
          :data-source="moviesData"
          field-expr="movieId"
        />
        <DxResource :data-source="theatreData" field-expr="theatreId" />

        <!-- dataCellTemplate slows down date navigation -->
        <template #dataCellTemplate="{}">
          <div>I'm slowing things down</div>
        </template>

        <template #AppointmentTemplateSlot="{ data }">
          <AppointmentTemplate :scheduler="scheduler" :template-model="data" />
        </template>
        
        <template #AppointmentTooltipTemplateSlot="{ data }">
          <AppointmentTooltipTemplate
            :scheduler="scheduler"
            :template-tooltip-model="data" />
        </template>
      </DxScheduler>
    </div>
  </example-block>
</template>

<script>
import ExampleBlock from "./example-block";
import DxScheduler, {
  DxResource
} from "devextreme-vue/scheduler";
import Query from "devextreme/data/query";
import AppointmentTemplate from "./AppointmentTemplate.vue";
import AppointmentTooltipTemplate from "./AppointmentTooltipTemplate.vue";
import { moviesData, theatreData, cinemaData } from "./scheduler-custom-data.js";

export default {
  components: {
    ExampleBlock,
    DxScheduler,
    DxResource,
    AppointmentTemplate,
    AppointmentTooltipTemplate
  },
  data() {
    return {
      views: ["day", "week", "timelineDay", "month"],
      groups: ["theatreId"],
      scheduler: null,
      currentDate: new Date(2021, 3, 27),
      dataSource: cinemaData,
      editing: { allowAdding: false },
      moviesData: moviesData,
      theatreData: theatreData
    };
  },
  methods: {
    onContentReady(e) {
      this.scheduler = e.component;
    },
    getMovieById(resourceId) {
      return Query(this.moviesData).filter(["id", resourceId]).toArray()[0];
    }
  }
};
</script>

<style>
.showtime-preview > div:first-child {
  font-size: 12px;
  white-space: normal;
}

.showtime-preview > div:not(:first-child) {
  font-size: 11px;
  white-space: normal;
}

.movie-tooltip .movie-info {
  display: inline-block;
  margin-left: 10px;
  vertical-align: top;
  text-align: left;
}

.movie-tooltip img {
  height: 80px;
  margin-bottom: 10px;
}

.movie-tooltip .movie-title {
  font-size: 1.5em;
  line-height: 40px;
}
</style> 