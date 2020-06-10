<template>
  <h1>{{ itemData.CompanyName }}</h1>
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
