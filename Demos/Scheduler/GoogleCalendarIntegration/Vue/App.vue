<template>
  <div>
    <div class="long-title">
      <h3>Tasks for Employees (USA Office)</h3>
    </div>
    <DxScheduler
      :data-source="dataSource"
      :current-date="currentDate"
      :views="views"
      :height="500"
      :editing="false"
      :show-all-day-panel="false"
      :start-day-hour="7"
      start-date-expr="start.dateTime"
      end-date-expr="end.dateTime"
      text-expr="summary"
      time-zone="America/Los_Angeles"
      current-view="workWeek"
    />
  </div>
</template>
<script>
import 'whatwg-fetch';
import DxScheduler from 'devextreme-vue/scheduler';
import CustomStore from 'devextreme/data/custom_store';

export default {
  components: {
    DxScheduler
  },
  data() {
    return {
      views: ['day', 'workWeek', 'month'],
      currentDate: new Date(2017, 4, 25),
      dataSource: new CustomStore({
        load: (options) => this.getData(options, { showDeleted: false })
      })
    };
  },
  methods: {
    getData(_, requestOptions) {
      const PUBLIC_KEY = 'AIzaSyBnNAISIUKe6xdhq1_rjor2rxoI3UlMY7k',
        CALENDAR_ID = 'f7jnetm22dsjc3npc2lu3buvu4@group.calendar.google.com';
      const dataUrl = [ 'https://www.googleapis.com/calendar/v3/calendars/',
        CALENDAR_ID, '/events?key=', PUBLIC_KEY].join('');

      return fetch(dataUrl, requestOptions).then(
        (response) => response.json()
      ).then((data) => data.items);
    }
  }
};
</script>
<style>
.long-title h3 {
    font-family: 'Segoe UI Light', 'Helvetica Neue Light', 'Segoe UI', 'Helvetica Neue', 'Trebuchet MS', Verdana;
    font-weight: 200;
    font-size: 28px;
    text-align: center;
    margin-bottom: 20px;
}
</style>
