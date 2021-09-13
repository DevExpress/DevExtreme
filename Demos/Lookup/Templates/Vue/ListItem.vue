<template>
  <div class="custom-item">
    <img :src="itemData.Picture"><div>{{ itemData.Prefix }}
      {{ itemData.FirstName }} {{ itemData.LastName }}</div>
  </div>
</template>
<script>
export default {
  props: {
    itemData: {
      type: Object,
      default: () => {},
    },
  },
};
</script>
<style scoped>
  .custom-item > img {
    height: 48px;
    width: 38px;
    margin-right: 10px;
  }

  .custom-item > div {
    display: inline-block;
    vertical-align: top;
    line-height: 48px;
    font-size: 15px;
  }
</style>
