<template>
  <li>
    <img :src="product.ImageSrc"><br>
    <div>{{ product.Name }}</div>
    <DxCheckBox
      @value-changed="onValueChanged"
      text="Available"
    />
  </li>
</template>
<script>
import { DxCheckBox } from 'devextreme-vue/check-box';

export default {
  components: {
    DxCheckBox,
  },
  props: {
    product: {
      type: Object,
      required: true,
      default: () => {},
    },
  },
  methods: {
    onValueChanged(e) {
      this.$emit('checked', e, this.product);
    },
  },
};
</script>
