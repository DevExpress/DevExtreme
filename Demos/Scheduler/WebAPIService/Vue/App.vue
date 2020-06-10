<template>
  <DxScheduler
    :data-source="dataSource"
    :current-date="currentDate"
    :views="views"
    :height="600"
    :start-day-hour="9"
    :end-day-hour="19"
    :remote-filtering="true"
    current-view="day"
    text-expr="Text"
    start-date-expr="StartDate"
    end-date-expr="EndDate"
    all-day-expr="AllDay"
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
      currentDate: new Date(2017, 4, 23),
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
