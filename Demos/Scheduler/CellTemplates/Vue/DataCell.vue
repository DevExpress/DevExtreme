<template>
  <div :class="markDataCell(cellData)"/>
</template>
<script>
import Utils from './utils.js';

export default {
  props: {
    cellData: {
      type: Object,
      default: () => {}
    }
  },
  methods: {
    markDataCell(cellData) {
      const date = cellData.startDate;
      const isDisableDate = Utils.isHoliday(date) || Utils.isWeekend(date);
      const isDinner = Utils.isDinner(date);

      return {
        'disable-date': isDisableDate,
        'dinner': isDinner
      };
    }
  }
};
</script>
