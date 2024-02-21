<template>
  <div class="showtime-preview">
    <div> {{ movieData.text }}</div>
    <div>
      Ticket Price: <strong>${{ templateModel.targetedAppointmentData.price }}</strong>
    </div>
    <div>
      {{ getFormatDate(templateModel.targetedAppointmentData.displayStartDate) }} -
      {{ getFormatDate(templateModel.targetedAppointmentData.displayEndDate) }}
    </div>
  </div>
</template>
<script setup lang="ts">
import { formatDate } from 'devextreme/localization';
import Query from 'devextreme/data/query';

import DxScheduler, { DxSchedulerTypes } from 'devextreme-vue/scheduler';
import { moviesData } from './data.ts';

const props = defineProps<{
  scheduler: DxScheduler['instance'];
  templateModel: DxSchedulerTypes.AppointmentTemplateData;
}>();

function getFormatDate(value) {
  return formatDate(value, 'shortTime');
}
const getMovieById = function(resourceId) {
  return Query(moviesData)
    .filter(['id', resourceId])
    .toArray()[0];
};

const movieData = getMovieById(props.templateModel.targetedAppointmentData.movieId);

</script>
<style scoped>
  .dx-tooltip-wrapper .dx-overlay-content .dx-popup-content {
    padding: 14px;
  }

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

  .long-title h3 {
    font-family:
      'Segoe UI Light',
      'Helvetica Neue Light',
      'Segoe UI',
      'Helvetica Neue',
      'Trebuchet MS',
      Verdana;
    font-weight: 200;
    font-size: 28px;
    text-align: center;
    margin-bottom: 20px;
  }

</style>
