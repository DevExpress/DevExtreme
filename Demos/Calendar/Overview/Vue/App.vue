<template>
  <div id="calendar-demo">
    <div class="widget-container">
      <DxCalendar
        id="calendar-container"
        v-model:value="currentValue"
        :min="minDateValue"
        :max="maxDateValue"
        :disabled-dates="disabledDates"
        :first-day-of-week="firstDay"
        :disabled="disabled"
        :zoom-level="zoomLevel"
        :cell-template="cellTemplate"
      >
        <template #custom="{ data: cell }">
          <span :class="getCellCssClass(cell.date)">
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
          text="Specified min value"
          @value-changed="setMinDate"
        />
      </div>
      <div class="option">
        <DxCheckBox
          :value="false"
          text="Specified max value"
          @value-changed="setMaxDate"
        />
      </div>
      <div class="option">
        <DxCheckBox
          :value="false"
          text="Disable weekend"
          @value-changed="disableWeekend"
        />
      </div>
      <div class="option">
        <DxCheckBox
          :value="false"
          text="Monday as the first day of a week"
          @value-changed="setFirstDay"
        />
      </div>
      <div class="option">
        <DxCheckBox
          :value="false"
          text="Use the Custom Cell Template"
          @value-changed="useCellTemplate"
        />
      </div>
      <div class="option">
        <DxCheckBox
          v-model:value="disabled"
          text="Disabled"
        />
      </div>
      <div class="option">
        <span>Zoom level</span>
        <DxSelectBox
          id="zoom-level"
          :data-source="zoomLevels"
          v-model:value="zoomLevel"
        />
      </div>
      <div class="option">
        <span>Selected date</span>
        <DxDateBox
          id="selected-date"
          v-model:value="currentValue"
          width="100%"
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
    DxCalendar
  },
  data() {
    return {
      minDateValue: null,
      maxDateValue: null,
      disabledDates: null,
      firstDay: 0,
      currentValue: new Date(),
      zoomLevels: ['month', 'year', 'decade', 'century'],
      cellTemplate: 'cell',
      disabled: false,
      zoomLevel: 'month'
    };
  },
  methods: {
    isWeekend(date) {
      const day = date.getDay();
      return day === 0 || day === 6;
    },
    setMinDate(e) {
      if(e.value) {
        this.minDateValue = new Date((new Date).getTime() - 1000 * 60 * 60 * 24 * 3);
      } else {
        this.minDateValue = null;
      }
    },
    setMaxDate(e) {
      if(e.value) {
        this.maxDateValue = new Date((new Date).getTime() + 1000 * 60 * 60 * 24 * 3);
      } else {
        this.maxDateValue = null;
      }
    },
    disableWeekend(e) {
      if(e.value) {
        this.disabledDates = (data) => data.view === 'month' && this.isWeekend(data.date);
      } else {
        this.disabledDates = null;
      }
    },
    setFirstDay(e) {
      if(e.value) {
        this.firstDay = 1;
      } else {
        this.firstDay = 0;
      }
    },
    useCellTemplate(e) {
      if(e.value) {
        this.cellTemplate = 'custom';
      } else {
        this.cellTemplate = 'cell';
      }
    },
    getCellCssClass(date) {
      let cssClass = '';
      const holydays = [[1, 0], [4, 6], [25, 11]];

      if(this.isWeekend(date))
      { cssClass = 'weekend'; }

      holydays.forEach((item) => {
        if(date.getDate() === item[0] && date.getMonth() === item[1]) {
          cssClass = 'holyday';
          return false;
        }
      });

      return cssClass;
    }
  }
};
</script>
<style scoped>
.widget-container {
    margin-right: 320px;
}

#calendar-container {
    margin: auto;
}

.dx-calendar-cell:not(.dx-calendar-other-month) .weekend,
.dx-calendar-cell:not(.dx-calendar-other-month) .holyday {
    text-shadow: none;
    font-weight: bold;
}

.dx-calendar-cell:not(.dx-calendar-other-month) .weekend {
    color: #3030FF;
}

.dx-state-disabled.dx-calendar .dx-calendar-cell:not(.dx-calendar-other-month) .weekend {
    color: #8080FF;
}

.dx-calendar-cell:not(.dx-calendar-other-month) .holyday {
    color: #FF3030;
}

.dx-state-disabled.dx-calendar .dx-calendar-cell:not(.dx-calendar-other-month) .holyday {
    color: #FF8080;
}

.options {
    padding: 20px;
    background-color: rgba(191, 191, 191, 0.15);
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
    width: 260px;
}

.caption {
    font-weight: 500;
    font-size: 18px;
}

.option {
    margin-top: 10px;
}
</style>
