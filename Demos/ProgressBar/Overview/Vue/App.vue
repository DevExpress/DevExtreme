<template>
  <div class="form">
    <DxButton
      id="progress-button"
      :text="buttonText"
      :width="200"
      :on-click="onButtonClick"
    />
    <div class="progress-info">
      Time left {{ time(seconds) }}
    </div>
    <DxProgressBar
      id="progress-bar-status"
      :class="{complete: seconds == 0}"
      :min="0"
      :max="maxValue"
      :status-format="statusFormat"
      :value="progressValue"
      width="90%"
    />
  </div>
</template>
<script>

import { DxButton } from 'devextreme-vue/button';
import { DxProgressBar } from 'devextreme-vue/progress-bar';

const maxValue = 10;

function statusFormat(value) {
  return `Loading: ${ value * 100 }%`;
}

export default {
  components: {
    DxButton,
    DxProgressBar
  },
  data() {
    return {
      maxValue,
      seconds: maxValue,
      buttonText: 'Start progress',
      inProgress: false,
      statusFormat
    };
  },
  computed: {
    progressValue() {
      return maxValue - this.seconds;
    }
  },
  methods: {
    time(value) {
      return `00:00:${ (`0${ value}`).slice(-2)}`;
    },
    onButtonClick() {
      if (this.inProgress) {
        this.buttonText = 'Continue progress';
        clearInterval(this.intervalId);
      } else {
        this.buttonText = 'Stop progress';

        if (this.seconds === 0) {
          this.seconds = maxValue;
        }

        this.intervalId = setInterval(() => this.timer(), 1000);
      }

      this.inProgress = !this.inProgress;
    },

    timer() {
      this.seconds = this.seconds - 1;

      if (this.seconds == 0) {
        this.buttonText = 'Restart progress';
        this.inProgress = !this.inProgress;
        clearInterval(this.intervalId);
      }
    }
  },
};
</script>
<style>
.form {
  padding: 20% 0;
  text-align: center;
}

#progress-button {
  margin-bottom: 20px;
}

#progress-bar-status {
  display: inline-block;
}

.complete .dx-progressbar-range {
  background-color: green;
}
</style>

