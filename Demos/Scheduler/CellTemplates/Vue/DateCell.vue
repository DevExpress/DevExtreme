<template>
  <div :class="markDateCell(cellData, currentView)">
    {{ cellData.text }}
  </div>
</template>
<script>
import Utils from './utils.js';

export default {
  props: {
    cellData: {
      type: Object,
      default: () => {},
    },
    currentView: {
      type: String,
      default: '',
    },
  },
  methods: {
    markDateCell(cellData, currentView) {
      const isDisabled = currentView === 'month'
        ? Utils.isWeekend(cellData.date)
        : Utils.isDisableDate(cellData.date);
      return { 'disable-date': isDisabled };
    },
  },
};
</script>
