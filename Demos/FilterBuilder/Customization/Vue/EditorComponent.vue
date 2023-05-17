<template>
  <DxTagBox
    :value="conditionInfo.value"
    :items="categories"
    :input-attr="{ 'aria-label': 'Category' }"
    width="auto"
    @value-changed="onValueChanged"
  />
</template>

<script>
import DxTagBox from 'devextreme-vue/tag-box';
import { categories } from './data.js';

export default {
  components: {
    DxTagBox,
  },
  props: {
    conditionInfo: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      categories,
    };
  },
  methods: {
    onValueChanged(e) {
      this.conditionInfo.setValue(e.value && e.value.length ? e.value : null);
    },
  },
};
</script>
