<template>
  <div>
    <div class="name">{{ dayOfWeekNames[cellData.date.getDay()] }}</div>
    <div class="number"> {{ cellData.date.getDate() }}</div>
  </div>
</template>
<script>

const dayOfWeekNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default {
  props: {
    cellData: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      dayOfWeekNames: dayOfWeekNames,
    };
  },
};
</script>
