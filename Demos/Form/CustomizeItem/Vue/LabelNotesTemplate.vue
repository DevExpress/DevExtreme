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
        <div id="tooltip-content">This field must not exceed 200 characters</div>
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

#tooltip-content {
  font-size: 14px;
  font-weight: bold;
}
</style>
