<template>
  <div id="container">
    <div class="calendar-container">
      <DxCalendar
        v-model:value="currentValue"
        v-model:zoom-level="zoomLevel"
        :min="minDateValue"
        :max="maxDateValue"
        :disabled-dates="disabledDates"
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
        <DxCheckBox
          v-model:value="showWeekNumbers"
          text="Show week numbers"
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
          :min="minDateValue"
          :max="maxDateValue"
        />
      </div>
    </div>
  </div>
</template>
<script>
import DxCheckBox from 'devextreme-vue/check-box';
import DxSelectBox from 'devextreme-vue/select-box';
import DxDateBox from 'devextreme-vue/date-box';
import DxCalendar from 'devextreme-vue/calendar';

export default {
  components: {
    DxCheckBox,
    DxSelectBox,
    DxDateBox,
    DxCalendar,
  },
  data() {
    return {
      minDateValue: null,
      maxDateValue: null,
      disabledDates: null,
      firstDay: 0,
      showWeekNumbers: false,
      weekNumberRule: 'auto',
      currentValue: new Date(),
      zoomLevels: ['month', 'year', 'decade', 'century'],
      cellTemplate: 'cell',
      disabled: false,
      zoomLevel: 'month',
      weekDays: [
        { id: 0, text: 'Sunday' },
        { id: 1, text: 'Monday' },
        { id: 2, text: 'Tuesday' },
        { id: 3, text: 'Wednesday' },
        { id: 4, text: 'Thursday' },
        { id: 5, text: 'Friday' },
        { id: 6, text: 'Saturday' },
      ],
      weekNumberRules: ['auto', 'firstDay', 'firstFourDays', 'fullWeek'],
    };
  },
  methods: {
    isWeekend(date) {
      const day = date.getDay();
      return day === 0 || day === 6;
    },
    setMinDate({ value }) {
      this.minDateValue = value
        ? new Date((new Date()).getTime() - 1000 * 60 * 60 * 24 * 3)
        : null;
    },
    setMaxDate({ value }) {
      this.maxDateValue = value
        ? new Date((new Date()).getTime() + 1000 * 60 * 60 * 24 * 3)
        : null;
    },
    disableWeekend({ value }) {
      this.disabledDates = value
        ? (data) => data.view === 'month' && this.isWeekend(data.date)
        : null;
    },
    useCellTemplate({ value }) {
      this.cellTemplate = value ? 'custom' : 'cell';
    },
    getCellCssClass({ date, view }) {
      let cssClass = '';
      const holidays = [[1, 0], [4, 6], [25, 11]];

      if (view === 'month') {
        if (!date) {
          cssClass = 'week-number';
        } else {
          if (this.isWeekend(date)) { cssClass = 'weekend'; }

          holidays.forEach((item) => {
            if (date.getDate() === item[0] && date.getMonth() === item[1]) {
              cssClass = 'holiday';
            }
          });
        }
      }

      return cssClass;
    },
  },
};
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
