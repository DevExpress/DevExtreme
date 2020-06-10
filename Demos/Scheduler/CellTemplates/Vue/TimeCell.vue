<template>
  <div :class="markTimeCell(cellData)">
    {{ cellData.text }}
    <div
      v-if="isDinner"
      class="cafe"
    />
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
  computed: {
    isDinner: function() {
      const date = this.cellData.date;
      return Utils.isDinner(date);
    }
  },
  methods: {
    markTimeCell(cellData) {
      return { 'dinner': Utils.isDinner(cellData.date) };
    }
  }
};
</script>
