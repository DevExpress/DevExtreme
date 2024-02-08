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
      :element-attr="{ 'aria-label': 'Progress Bar' }"
      width="90%"
    />
  </div>
</template>
<script setup lang="ts">
import { computed, ref } from 'vue';
import { DxButton } from 'devextreme-vue/button';
import { DxProgressBar } from 'devextreme-vue/progress-bar';

const maxValue = 10;
const seconds = ref(maxValue);
const buttonText = ref('Start progress');
const inProgress = ref(false);
const progressValue = computed(() => maxValue - seconds.value);
const statusFormat = (ratio) => `Loading: ${ratio * 100}%`;
const time = (value) => `00:00:${(`0${value}`).slice(-2)}`;
let intervalId;

function onButtonClick() {
  if (inProgress.value) {
    buttonText.value = 'Continue progress';
    clearInterval(intervalId);
  } else {
    buttonText.value = 'Stop progress';

    if (seconds.value === 0) {
      seconds.value = maxValue;
    }

    intervalId = setInterval(() => timer(), 1000);
  }

  inProgress.value = !inProgress.value;
}
function timer() {
  seconds.value -= 1;

  if (seconds.value === 0) {
    buttonText.value = 'Restart progress';
    inProgress.value = !inProgress.value;
    clearInterval(intervalId);
  }
}
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
  padding-top: 8px;
}

.complete .dx-progressbar-range {
  background-color: green;
}
</style>

