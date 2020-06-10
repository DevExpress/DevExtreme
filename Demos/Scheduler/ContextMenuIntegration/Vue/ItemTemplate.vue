<template>
  <div>
    <div
      v-if="itemData.color"
      :style="styleObject"
      class="item-badge"
    />
    {{ itemData.text }}
  </div>
</template>

<script>
export default {
  props: {
    itemData: {
      type: Object,
      default: function() { }
    },
  },
  data() {
    return {
      styleObject: { backgroundColor: this.itemData.color }
    };
  }
};
</script>

<style scoped>
  .item-badge {
    text-align: center;
    float: left;
    margin-right: 12px;
    color: white;
    width: 18px;
    height: 18px;
    font-size: 19.5px;
    border-radius: 18px;
    margin-top: 2px;
  }
</style>
