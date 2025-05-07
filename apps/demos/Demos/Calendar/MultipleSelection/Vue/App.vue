<template>
  <div id="calendar-demo">
    <div class="calendar-container">
      <DxCalendar
        ref="calendarRef"
        :value="initialValue"
        :show-week-numbers="true"
        :select-week-on-click="selectWeekOnClick"
        :selection-mode="selectionMode"
        :min="minDateValue"
        :max="maxDateValue"
        :disabled-dates="disabledDates"
      />
    </div>
    <div class="options">
      <div class="caption">Options</div>
      <div class="option">
        <DxCheckBox
          v-model:value="selectWeekOnClick"
          text="Select week on click"
        />
      </div>
      <div class="option">
        <span>Selection mode</span>
        <DxSelectBox
          v-model:value="selectionMode"
          :data-source="selectionModes"
          :input-attr="{ 'aria-label': 'Selection Mode' }"
        />
      </div>
      <div class="option caption">
        <span>Date availability</span>
      </div>
      <div class="option">
        <DxCheckBox
          :value="false"
          text="Set minimum date"
          @value-changed="setMinDate"
        />
      </div>
      <div class="option">
        <DxCheckBox
          :value="false"
          text="Set maximum date"
          @value-changed="setMaxDate"
        />
      </div>
      <div class="option">
        <DxCheckBox
          :value="false"
          text="Disable weekends"
          @value-changed="disableWeekend"
        />
      </div>
      <div class="option">
        <DxButton
          text="Clear value"
          @click="clearValue"
        />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import DxCheckBox, { type DxCheckBoxTypes } from 'devextreme-vue/check-box';
import DxSelectBox from 'devextreme-vue/select-box';
import DxCalendar, { type DxCalendarTypes } from 'devextreme-vue/calendar';
import DxButton from 'devextreme-vue/button';

const calendarRef = ref();
const initialValue = [new Date(), new Date(new Date().getTime() + 1000 * 60 * 60 * 24)];
const selectWeekOnClick = ref(true);
const selectionMode = ref<DxCalendarTypes.CalendarSelectionMode>('multiple');
const minDateValue = ref();
const maxDateValue = ref();
const disabledDates = ref();
const selectionModes: DxCalendarTypes.CalendarSelectionMode[] = ['single', 'multiple', 'range'];

function isWeekend(date: Date) {
  const day = date.getDay();
  return day === 0 || day === 6;
}

function setMinDate({ value }: DxCheckBoxTypes.ValueChangedEvent) {
  minDateValue.value = value
    ? new Date((new Date()).getTime() - 1000 * 60 * 60 * 24 * 3)
    : null;
}

function setMaxDate({ value }: DxCheckBoxTypes.ValueChangedEvent) {
  maxDateValue.value = value
    ? new Date((new Date()).getTime() + 1000 * 60 * 60 * 24 * 3)
    : null;
}

function disableWeekend({ value }: DxCheckBoxTypes.ValueChangedEvent) {
  disabledDates.value = value
    ? (data: Record<string, string | Date>) => data.view === 'month' && isWeekend(data.date as Date)
    : null;
}

function clearValue() {
  calendarRef.value.instance.clear();
}

</script>
<style scoped>
#calendar-demo {
  display: flex;
}

.calendar-container {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  align-items: center;
  justify-content: center;
}

.caption {
  font-weight: 500;
  font-size: 18px;
}

.options {
  padding: 20px;
  background-color: rgba(191, 191, 191, 0.15);
}

.option {
  margin-top: 10px;
}
</style>
