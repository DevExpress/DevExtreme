<template>
  <DataCell
    class="dx-scheduler-date-table-cell-text"
    :cell-data="cellData"
  >
    {{ day() }}
  </DataCell>
</template>
<script>
import DataCell from './DataCell.vue';

export default {
  components: {
    DataCell,
  },
  props: {
    cellData: {
      type: Object,
      default: () => {},
    },
  },
  methods: {
    day() {
      return this.cellData.startDate.getDate();
    },
  },
};
</script>
