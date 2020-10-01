<template>
  <div>
    <div class="dx-fieldset">
      <div class="dx-field">
        <div class="dx-field-label">Date</div>
        <div class="dx-field-value">
          <DxDateBox
            :value="now"
            type="date"
          />
        </div>
      </div>
      <div class="dx-field">
        <div class="dx-field-label">Time</div>
        <div class="dx-field-value">
          <DxDateBox
            :value="now"
            type="time"
          />
        </div>
      </div>
      <div class="dx-field">
        <div class="dx-field-label">Date and time</div>
        <div class="dx-field-value">
          <DxDateBox
            :value="now"
            type="datetime"
          />
        </div>
      </div>
      <div class="dx-field">
        <div class="dx-field-label">Custom format</div>
        <div class="dx-field-value">
          <DxDateBox
            :value="now"
            display-format="EEEE, MMM dd"
          />
        </div>
      </div>
      <div class="dx-field">
        <div class="dx-field-label">Date picker</div>
        <div class="dx-field-value">
          <DxDateBox
            :value="now"
            picker-type="rollers"
          />
        </div>
      </div>
      <div class="dx-field">
        <div class="dx-field-label">Clear button</div>
        <div class="dx-field-value">
          <DxDateBox
            :value="dateClear"
            :show-clear-button="true"
            type="time"
          />
        </div>
      </div>
      <div class="dx-field">
        <div class="dx-field-label">Disabled</div>
        <div class="dx-field-value">
          <DxDateBox
            :value="now"
            :disabled="true"
            type="datetime"
          />
        </div>
      </div>
      <div class="dx-field">
        <div class="dx-field-label">Disable certain dates</div>
        <div class="dx-field-value">
          <DxDateBox
            :value="firstWorkDay2017"
            :disabled-dates="disabledDates"
            type="date"
            picker-type="calendar"
          />
        </div>
      </div>
    </div>
    <div class="dx-fieldset">
      <div class="dx-fieldset-header">Event Handling</div>
      <div class="dx-field">
        <div class="dx-field-label">Set Birthday</div>
        <div class="dx-field-value">
          <DxDateBox
            v-model:value="value"
            :min="min"
            :max="now"
            apply-value-mode="useButtons"
          />
        </div>
      </div>
      <div class="dx-field">
        <div class="dx-field-value">
          Your age is <div id="age">{{ diffInDay }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import DxDateBox from 'devextreme-vue/date-box';

import service from './data.js';

export default {
  components: {
    DxDateBox
  },
  data() {
    return {
      value: new Date(1981, 3, 27),
      now: new Date(),
      firstWorkDay2017: new Date(2017, 0, 3),
      min: new Date(1900, 0, 1),
      dateClear: new Date(2015, 11, 1, 6),
      disabledDates: service.getFederalHolidays()
    };
  },
  computed: {
    diffInDay() {
      return (
        `${Math.floor(
          Math.abs(
            (new Date().getTime() - this.value.getTime()) /
              (24 * 60 * 60 * 1000)
          )
        ) } days`
      );
    }
  }
};
</script>
<style scoped>
#age {
  display: inline-block;
}
</style>
