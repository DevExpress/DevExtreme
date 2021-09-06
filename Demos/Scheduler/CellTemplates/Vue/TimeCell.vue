<template>
  <div :class="markTimeCell(cellData)">
    {{ cellData.text }}
    <div
      v-if="hasCoffeeCupIcon"
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
      default: () => {},
    },
  },
  computed: {
    isDinner() {
      const { date } = this.cellData;
      return Utils.isDinner(date);
    },
    hasCoffeeCupIcon() {
      const { date } = this.cellData;
      return Utils.hasCoffeeCupIcon(date);
    },
  },
  methods: {
    markTimeCell(cellData) {
      return { dinner: Utils.isDinner(cellData.date) };
    },
  },
};
</script>
