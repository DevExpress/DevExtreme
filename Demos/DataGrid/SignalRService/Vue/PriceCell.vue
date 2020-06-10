<template>
  <div :class="{ inc: cellData.data.change > 0, dec: cellData.data.change < 0 }">
    <span>{{ cellData.text }}</span>
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
