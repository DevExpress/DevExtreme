<template>
  <div class="custom-icon">
    <span class="dx-icon-box icon"/>
    {{ itemData.key }}
  </div>
</template>
<script>
export default {
  props: {
    itemData: {
      type: Object,
      default: () => {}
    }
  }
};
</script>
<style scoped>
  .custom-icon .icon {
    font-size: 17px;
    color: #f05b41;
    margin-right: 2px;
  }
</style>
