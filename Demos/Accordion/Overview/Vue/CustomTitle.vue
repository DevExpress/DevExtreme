<template>
  <div class="header">{{ itemData.CompanyName }}</div>
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
