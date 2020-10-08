<template>
  <div class="form">

    <div class="label">Custom size</div>

    <DxLoadIndicator
      id="small-indicator"
      :height="20"
      :width="20"
    />
    <DxLoadIndicator
      id="medium-indicator"
      :height="40"
      :width="40"
    />
    <DxLoadIndicator
      id="large-indicator"
      :height="60"
      :width="60"
    />

    <div class="label">Custom image</div>

    <DxLoadIndicator
      id="image-indicator"
      indicator-src="../../../../images/Loading.gif"
    />

    <div class="label">Using with other widgets</div>

    <DxButton
      id="button"
      :width="180"
      :height="40"
      :on-click="handleClick"
    >
      <template #content>
        <span>
          <DxLoadIndicator
            :visible="loadIndicatorVisible"
            class="button-indicator"
          />
          <span class="dx-button-text">{{ buttonText }}</span>
        </span>
      </template>
    </DxButton>
  </div>
</template>
<script>
import { DxButton } from 'devextreme-vue/button';
import { DxLoadIndicator } from 'devextreme-vue/load-indicator';

export default {
  components: {
    DxButton,
    DxLoadIndicator
  },
  data() {
    return {
      loadIndicatorVisible: false,
      buttonText: 'Send'
    };
  },
  methods: {
    handleClick() {
      this.loadIndicatorVisible = true;
      this.buttonText = 'Sending';

      setTimeout(() => {
        this.loadIndicatorVisible = false;
        this.buttonText = 'Send';
      }, 2000);
    }
  }
};
</script>
<style>
.form {
  padding: 10px 0 0 10px;
}

.label {
  margin-bottom: 10px;
  font-size: 16px;
}

.label:not(:first-child) {
  margin-top: 30px;
}

#small-indicator,
#medium-indicator,
#large-indicator {
  vertical-align: middle;
  margin-right: 10px;
}

#button,
#button .dx-button-content {
  padding: 0;
}

#button .button-indicator {
  height: 32px;
  width: 32px;
  display: inline-block;
  vertical-align: middle;
  margin-right: 5px;
}
</style>
