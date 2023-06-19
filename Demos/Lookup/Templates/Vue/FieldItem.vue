<template>
  <div class="custom-field">
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
  .custom-field > img {
    vertical-align: middle;
    height: 30px;
    width: 21px;
  }

  .custom-field > div {
    display: inline-block;
    vertical-align: middle;
    line-height: 30px;
    font-size: 14px;
    margin-left: 5px;
  }
</style>
