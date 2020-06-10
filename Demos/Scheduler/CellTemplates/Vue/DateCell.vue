<template>
  <div :class="markDateCell(cellData)">
    {{ cellData.text }}
  </div>
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
    markDateCell(cellData) {
      return { 'disable-date': Utils.isWeekend(cellData.date) };
    }
  }
};
</script>
