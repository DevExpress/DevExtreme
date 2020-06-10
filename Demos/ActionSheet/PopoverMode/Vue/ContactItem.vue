<template>
  <div>
    <div>{{ itemData.name }}</div>
    <div>{{ itemData.phone }}</div>
    <div>{{ itemData.email }}</div>
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
