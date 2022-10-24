<template>
  <span>
    <i class="dx-icon dx-icon-comment"/>Additional
    <br>
    <i
      id="helpedInfo"
      class="dx-icon dx-icon-info"
    />{{ data.text }}
    <DxTooltip
      target="#helpedInfo"
      show-event="mouseenter"
      hide-event="mouseleave"
    >
      <template #content>
        <b>This field must not exceed 200 characters</b>
      </template>
    </DxTooltip>
  </span>
</template>
<script>
import { DxTooltip } from 'devextreme-vue/tooltip';

export default {
  components: {
    DxTooltip,
  },
  props: {
    data: {
      type: Object,
      default: () => {},
    },
  },
};
</script>
<style scoped>
#helpedInfo {
  color: #42a5f5;
}
</style>
