<template>
  <DxScheduler
    time-zone="America/Los_Angeles"
    :data-source="dataSource"
    :current-date="currentDate"
    :views="views"
    :height="600"
    :start-day-hour="9"
    :end-day-hour="19"
    :remote-filtering="true"
    current-view="day"
    date-serialization-format="yyyy-MM-ddTHH:mm:ssZ"
    text-expr="Text"
    start-date-expr="StartDate"
    end-date-expr="EndDate"
    all-day-expr="AllDay"
    recurrence-rule-expr="RecurrenceRule"
    recurrence-exception-expr="RecurrenceException"
  />
</template>
<script>
import DxScheduler from 'devextreme-vue/scheduler';
import * as AspNetData from 'devextreme-aspnet-data-nojquery';

const url = 'https://js.devexpress.com/Demos/Mvc/api/SchedulerData';

export default {
  components: {
    DxScheduler
  },
  data() {
    return {
      views: ['day', 'workWeek', 'month'],
      currentDate: new Date(2021, 3, 27),
      dataSource: AspNetData.createStore({
        key: 'AppointmentId',
        loadUrl: `${url }/Get`,
        insertUrl: `${url }/Post`,
        updateUrl: `${url }/Put`,
        deleteUrl: `${url }/Delete`,
        onBeforeSend(_, ajaxOptions) {
          ajaxOptions.xhrFields = { withCredentials: true };
        }
      })
    };
  }
};
</script>
