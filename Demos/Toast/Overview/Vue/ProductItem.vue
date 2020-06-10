<template>
  <li>
    <img :src="product.ImageSrc"><br>
    <div id="name">{{ product.Name }}</div>
    <DxCheckBox
      :on-value-changed="checkAvailability"
      text="Available"
    />
  </li>
</template>
<script>
import notify from 'devextreme/ui/notify';
import { DxCheckBox } from 'devextreme-vue/check-box';

export default {
  components: {
    DxCheckBox
  },

  props: {
    product: {
      type: Object,
      required: true,
      default: () => {}
    }
  },

  methods: {
    checkAvailability(e) {
      const type = e.value ? 'success' : 'error';
      const text =
        this.product.Name + (e.value ? ' is available' : ' is not available');

      notify(text, type, 600);
    }
  }
};
</script>
