<template>
  <div>
    <h1>John Heart</h1>

    <DxButton
      :on-click="showLoadPanel"
      text="Load Data"
    />

    <div id="employee">
      <p>
        Birth date: <b>{{ employeeInfo.Birth_Date }}</b>
      </p>
      <p class="address">
        Address:<br>
        <b>{{ employeeInfo.City }}</b><br>
        <span>{{ employeeInfo.Zipcode }}</span>
        <span>{{ employeeInfo.Address }}</span>
      </p>
      <p>
        Phone:
        <b>{{ employeeInfo.Mobile_Phone }}</b><br>
        Email: <b>{{ employeeInfo.Email }}</b>
      </p>
    </div>

    <DxLoadPanel
      :position="position"
      v-model:visible="loadingVisible"
      :show-indicator="showIndicator"
      :show-pane="showPane"
      :shading="shading"
      :close-on-outside-click="closeOnOutsideClick"
      :on-shown="onShown"
      :on-hidden="onHidden"
      shading-color="rgba(0,0,0,0.4)"
    />

    <div class="options">
      <div class="caption">Options</div>
      <div class="option">
        <DxCheckBox
          v-model:value="showIndicator"
          text="With indicator"
        />
      </div>
      <div class="option">
        <DxCheckBox
          v-model:value="shading"
          text="With overlay"
        />
      </div>
      <div class="option">
        <DxCheckBox
          v-model:value="showPane"
          text="With pane"
        />
      </div>
      <div class="option">
        <DxCheckBox
          v-model:value="closeOnOutsideClick"
          text="Close on outside click"
        />
      </div>
    </div>

  </div>
</template>
<script>
import { DxButton } from 'devextreme-vue/button';
import { DxCheckBox } from 'devextreme-vue/check-box';
import { DxLoadPanel } from 'devextreme-vue/load-panel';
import { employee } from './data.js';

export default {
  components: {
    DxButton,
    DxCheckBox,
    DxLoadPanel
  },

  data() {
    return {
      employeeInfo: {},
      loadingVisible: false,
      position: { of: '#employee' },
      showIndicator: true,
      shading: true,
      showPane: true,
      closeOnOutsideClick: false
    };
  },

  methods: {
    showLoadPanel() {
      this.employeeInfo = {};
      this.loadingVisible = true;
    },
    onShown() {
      setTimeout(() => {
        this.loadingVisible = false;
      }, 3000);
    },
    onHidden() {
      this.employeeInfo = employee;
    }
  }
};
</script>
<style>
h1 {
  display: inline-block;
  vertical-align: middle;
  padding: 10px;
  margin: 0 0.1em 0 0;
}

#employee {
  margin: 20px 0;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  border-top: 1px solid lightgray;
  border-bottom: 1px solid lightgray;
}

#employee > p {
  padding: 10px 20px;
  margin: 0;
}

.address {
  height: 60px;
}

.options {
  padding: 20px;
  background-color: rgba(191, 191, 191, 0.15);
  margin-top: 20px;
}

.caption {
  font-size: 18px;
  font-weight: 500;
}

.option {
  margin-top: 10px;
}
</style>

