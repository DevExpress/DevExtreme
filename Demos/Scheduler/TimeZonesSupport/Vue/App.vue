<template>
  <div>
    <div class="option">
      <span>Office Time Zone</span>
      <DxSelectBox
        :items="locationsData"
        v-model:value="timezone"
        :width="240"
        display-expr="title"
        value-expr="id"
      />
    </div>
    <DxScheduler
      :data-source="dataSource"
      :current-date="currentDate"
      :views="views"
      :height="600"
      :start-day-hour="8"
      :time-zone="timezone"
      current-view="workWeek"
      :on-appointment-form-opening="onAppointmentFormOpening"
      :on-option-changed="onOptionChanged"
    >
      <DxEditing
        :allow-editing-time-zones="true"
      />
    </DxScheduler>
  </div>
</template>
<script>

import DxScheduler, { DxEditing } from 'devextreme-vue/scheduler';
import DxSelectBox from 'devextreme-vue/select-box';
import timeZoneUtils from 'devextreme/time_zone_utils';

import { data, locations } from './data.js';

const getLocations = function(date) {
    const timeZones = timeZoneUtils.getTimeZones(date);
    return timeZones.filter((timeZone) => {
        return locations.indexOf(timeZone.id) !== -1;
    });
};

const currentDate = new Date(2021, 4, 25);
const demoLocations = getLocations(currentDate);

export default {
  components: {
    DxScheduler,
    DxSelectBox,
    DxEditing
  },
  data() {
    return {
      views: ['workWeek'],
      currentDate: currentDate,
      timezone: demoLocations[0].id,
      dataSource: data,
      locationsData: demoLocations
    };
  },
  methods: {
    onAppointmentFormOpening: function(args) {
      const form = e.form;

      const startDateTimezoneEditor = form.getEditor('startDateTimeZone');
      const endDateTimezoneEditor = form.getEditor('endDateTimeZone');
      const startDateDataSource = startDateTimezoneEditor.option('dataSource');
      const endDateDataSource = endDateTimezoneEditor.option('dataSource');

      startDateDataSource.filter(['id', 'contains', 'Europe']);
      endDateDataSource.filter(['id', 'contains', 'Europe']);

      startDateDataSource.load();
      endDateDataSource.load();
    },
    onOptionChanged: function(args) {
      if(args.name === 'currentDate') {      
        this.locationsData = getLocations(args.value);
      }
    }
  }
};
</script>

<style scoped>
  .option {
    display: flex;
  }

  .option > span {
    display: flex;
    align-items: center;
    margin-right: 10px;
  }

  .dx-scheduler {
    margin-top: 20px;
  }
</style>
