<template>
  <div>
    <DxForm
      id="form"
      :form-data="employee"
      :col-count-by-screen="colCountByScreen"
      :screen-by-width="screenByWidth"
      :min-col-width="233"
      label-location="top"
      col-count="auto"
    />
    <div class="options">
      <div class="caption">Options</div>
      <div class="option">
        <DxCheckBox
          :text="'Calculate the number of columns automatically'"
          v-model:value="calculateColCountAutomatically"
        />
      </div>
    </div>
  </div>
</template>
<script>
import DxCheckBox from 'devextreme-vue/check-box';
import DxForm from 'devextreme-vue/form';
import employee from './data.js';

export default {
  components: {
    DxCheckBox,
    DxForm
  },
  data() {
    return {
      employee,
      calculateColCountAutomatically: false
    };
  },
  computed: {
    colCountByScreen() {
      return this.calculateColCountAutomatically
        ? null
        : {
          sm: 2,
          md: 4
        };
    }
  },
  methods: {
    screenByWidth(width) {
      return width < 720 ? 'sm' : 'md';
    }
  }
};
</script>
<style scoped>
#form {
    padding: 10px 10px 110px;
}

.options {
    padding: 20px;
    background-color: rgba(191, 191, 191, 0.15);
    left: 0;
    position: absolute;
    bottom: 0;
    right: 0;
}

.caption {
    font-size: 18px;
    font-weight: 500;
}

.option {
    margin-top: 10px;
}
</style>
