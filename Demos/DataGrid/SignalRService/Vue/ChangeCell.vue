<template>
  <div :class="{ inc: cellData.data.change > 0, dec: cellData.data.change < 0 }">
    <span class="current-value">{{ cellData.text }}</span>
    <span class="arrow"/>
    <span class="diff">{{ cellData.data.percentChange.toFixed(2) }}%</span>
  </div>
</template>

<script>
export default {
  props: {
    cellData: {
      type: Object,
      default: () => {}
    }
  }
};
</script>
