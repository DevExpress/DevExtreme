<template>
  <div id="container">
    <div class="calendar-container">
      <DxCalendar
        v-model:value="currentValue"
        v-model:zoom-level="zoomLevel"
        :first-day-of-week="firstDay"
        :show-week-numbers="showWeekNumbers"
        :week-number-rule="weekNumberRule"
        :disabled="disabled"
        :cell-template="cellTemplate"
      >
        <template #custom="{ data: cell }">
          <span :class="getCellCssClass(cell)">
            {{ cell.text }}
          </span>
        </template>
      </DxCalendar>
    </div>
    <div class="options">
      <div class="caption">Options</div>
      <div class="option">
        <span>Zoom level</span>
        <DxSelectBox
          v-model:value="zoomLevel"
          :input-attr="{ 'aria-label': 'Zoom Level' }"
          :data-source="zoomLevels"
        />
      </div>
      <div class="option">
        <span>Selected date</span>
        <DxDateBox
          v-model:value="currentValue"
          :input-attr="{ 'aria-label': 'Date' }"
        />
      </div>
      <div class="option">
        <DxCheckBox
          :value="false"
          text="Use custom cell template"
          @value-changed="useCellTemplate"
        />
      </div>
      <div class="option">
        <DxCheckBox
          v-model:value="disabled"
          text="Disable the calendar"
        />
      </div>
      <div class="caption option">
        <span>Week numeration</span>
      </div>
      <div class="option">
        <DxCheckBox
          v-model:value="showWeekNumbers"
          text="Show week numbers"
        />
      </div>
      <div class="option">
        <span>First day of week</span>
        <DxSelectBox
          v-model:value="firstDay"
          :data-source="weekDays"
          :input-attr="{ 'aria-label': 'First Day of Week' }"
          value-expr="id"
          display-expr="text"
        />
      </div>
      <div class="option">
        <span>Week number rule</span>
        <DxSelectBox
          v-model:value="weekNumberRule"
          :input-attr="{ 'aria-label': 'Week Number Rule' }"
          :data-source="weekNumberRules"
        />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import DxCheckBox from 'devextreme-vue/check-box';
import DxSelectBox from 'devextreme-vue/select-box';
import DxDateBox from 'devextreme-vue/date-box';
import DxCalendar from 'devextreme-vue/calendar';

const zoomLevels = ['month', 'year', 'decade', 'century'];
const zoomLevel = ref('month');
const currentValue = ref(new Date());
const cellTemplate = ref('cell');
const disabled = ref(false);
const showWeekNumbers = ref(false);
const firstDay = ref(0);
const weekNumberRule = ref('auto');
const weekDays = [
  { id: 0, text: 'Sunday' },
  { id: 1, text: 'Monday' },
  { id: 2, text: 'Tuesday' },
  { id: 3, text: 'Wednesday' },
  { id: 4, text: 'Thursday' },
  { id: 5, text: 'Friday' },
  { id: 6, text: 'Saturday' },
];
const weekNumberRules = ['auto', 'firstDay', 'firstFourDays', 'fullWeek'];

function isWeekend(date) {
  const day = date.getDay();
  return day === 0 || day === 6;
}

function useCellTemplate({ value }) {
  cellTemplate.value = value ? 'custom' : 'cell';
}

function getCellCssClass({ date, view }) {
  let cssClass = '';
  const holidays = [[1, 0], [4, 6], [25, 11]];

  if (view === 'month') {
    if (!date) {
      cssClass = 'week-number';
    } else {
      if (isWeekend(date)) { cssClass = 'weekend'; }

      holidays.forEach((item) => {
        if (date.getDate() === item[0] && date.getMonth() === item[1]) {
          cssClass = 'holiday';
        }
      });
    }
  }

  return cssClass;
}
</script>
<style scoped>
#container {
  display: flex;
}

.calendar-container {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  align-items: center;
  justify-content: center;
}

.dx-calendar-cell:not(.dx-calendar-other-month) .weekend,
.dx-calendar-cell:not(.dx-calendar-other-month) .holiday {
  text-shadow: none;
  font-weight: bold;
}

.dx-calendar-cell:not(.dx-calendar-other-month) .weekend {
  color: #3030ff;
}

.dx-state-disabled.dx-calendar .dx-calendar-cell:not(.dx-calendar-other-month) .weekend {
  color: #8080ff;
}

.dx-calendar-cell:not(.dx-calendar-other-month) .holiday {
  color: #ff3030;
}

.dx-state-disabled.dx-calendar .dx-calendar-cell:not(.dx-calendar-other-month) .holiday {
  color: #ff8080;
}

.dx-calendar-week-number-cell .week-number {
  font-style: italic;
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
