<template>
  <div>
    <DxScheduler
      :data-source="dataSource"
      :current-date="currentDate"
      :views="views"
      :show-current-time-indicator="showCurrentTimeIndicator"
      :shade-until-current-time="shadeUntilCurrentTime"
      @content-ready="onContentReady"
      @appointment-click="onAppointmentClick"
      @appointment-dbl-click="onAppointmentDblClick"
      :editing="false"
      :show-all-day-panel="false"
      appointment-template="AppointmentTemplateSlot"
      height="600"
      current-view="week"
    >
      <DxResource
        :data-source="moviesData"
        field-expr="movieId"
      />
      <template #AppointmentTemplateSlot="{ data }">
        <AppointmentTemplate :appointment-model="data"/>
      </template>
    </DxScheduler>
    <div class="options">
      <div class="column">
        <div class="option">
          <div class="label">Current time indicator</div>
          <div class="value">
            <DxSwitch
              id="show-indicator"
              v-model:value="showCurrentTimeIndicator"
            />
          </div>
        </div>
        <div class="option">
          <div class="label">Shading until current time</div>
          <div class="value">
            <DxSwitch
              id="allow-shading"
              v-model:value="shadeUntilCurrentTime"
            />
          </div>
        </div>
      </div>
      <div class="column">
        <div class="option">
          <div class="label">Update position in</div>
          <div class="value">
            <DxNumberBox
              v-model:value="updateInterval"
              :format="'#0 s'"
              :min="1"
              :max="1200"
              :step="10"
              :show-spin-buttons="true"
              width="100"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>

import DxScheduler, { DxResource } from 'devextreme-vue/scheduler';
import { DxSwitch } from 'devextreme-vue/switch';
import { DxNumberBox } from 'devextreme-vue/number-box';

import AppointmentTemplate from './AppointmentTemplate.vue';
import { data, moviesData } from './data.js';

export default {
  components: {
    DxScheduler,
    DxResource,
    DxSwitch,
    DxNumberBox,
    AppointmentTemplate
  },
  data() {
    return {
      views: ['week', 'timelineWeek'],
      currentDate: new Date(),
      showCurrentTimeIndicator: true,
      shadeUntilCurrentTime: true,
      updateInterval: 10,
      dataSource: data,
      moviesData: moviesData,
    };
  },
  methods: {
    onContentReady: function(e) {
      e.component.scrollTo(new Date());
    },

    onAppointmentClick: function(e) {
      e.cancel = true;
    },

    onAppointmentDblClick: function(e) {
      e.cancel = true;
    }
  }
};
</script>

<style scoped>
  .dx-scheduler-appointment {
    color: #000000;
    font-weight: 500;
    background-color: #e4e4e4;
  }

  .dx-scheduler-appointment-recurrence .dx-scheduler-appointment-content {
    padding: 5px 0px 5px 7px;
  }

  .options {
    background-color: rgba(191, 191, 191, 0.15);
    margin-top: 20px;
  }

  .column {
    width: 40%;
    display: inline-block;
    margin: 15px 3%;
    text-align: left;
    vertical-align: top;
  }

  .column:last-child .option {
      margin-left: 4px;
  }

  .option {
    padding: 5px 0;
  }

  .label, .value {
    display: inline-block;
    vertical-align: middle;
  }

  .label {
    width: 184px;
  }

  .value {
    width: 30%;
  }

  .movie img {
    height: 70px;
  }

  .movie-text {
    font-size: 90%;
    white-space: normal;
  }

  #allow-shading, #show-indicator {
    height: 36px;
  }
</style>
