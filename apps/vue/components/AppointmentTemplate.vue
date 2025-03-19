<template>
  <div class="showtime-preview">
    AppointmentTemplateSlot test
    <div>{{ movieData.text }}</div>
    <div>
      Ticket Price: <strong>${{ templateModel.targetedAppointmentData.price }}</strong>
    </div>
    <div>
      {{ getFormatDate(templateModel.targetedAppointmentData.displayStartDate) }} -
      {{ getFormatDate(templateModel.targetedAppointmentData.displayEndDate) }}
    </div>
  </div>
</template>

<script>
import { formatDate } from 'devextreme/localization';
import Query from 'devextreme/data/query';
import { moviesData } from './scheduler-custom-data.js';

export default {
  props: {
    scheduler: Object,
    templateModel: Object
  },
  computed: {
    movieData() {
      return this.getMovieById(this.templateModel.targetedAppointmentData.movieId);
    }
  },
  methods: {
    getFormatDate(value) {
      return formatDate(value, 'shortTime');
    },
    getMovieById(resourceId) {
      return Query(moviesData)
        .filter(['id', resourceId])
        .toArray()[0];
    }
  }
};
</script>

<style scoped>
.showtime-preview > div:first-child {
  font-size: 12px;
  white-space: normal;
}

.showtime-preview > div:not(:first-child) {
  font-size: 11px;
  white-space: normal;
}
</style> 