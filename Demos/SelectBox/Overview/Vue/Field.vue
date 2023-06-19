<template>
  <div class="custom-item">
    <img
      v-if="fieldData"
      :src="fieldData.ImageSrc"
    >
    <DxTextBox
      :value="fieldData && fieldData.Name"
      :read-only="true"
      :input-attr="{ 'aria-label': 'Name' }"
      class="product-name"
    />
  </div>
</template>
<script>
import DxTextBox from 'devextreme-vue/text-box';

export default {
  components: {
    DxTextBox,
  },
  props: {
    fieldData: {
      type: Object,
      default: () => {},
    },
  },
};
</script>
