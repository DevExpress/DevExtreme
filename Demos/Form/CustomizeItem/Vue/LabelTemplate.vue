<template>
  <div>
    <i :class="iconClass"/>{{ data.text }}
  </div>
</template>
<script>
export default {
  props: {
    data: {
      type: Object,
      default: () => {},
    },
    icon: {
      type: String,
      default: 'info',
    },
  },
  data() {
    return {
      iconClass: `dx-icon dx-icon-${this.icon}`,
    };
  },
};
</script>
