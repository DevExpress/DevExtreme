<template>
  <div>
    <div class="options">
      <div>Position</div>
      <DxRadioGroup
        layout="horizontal"
        :items="['predefined', 'coordinates']"
        value="predefined"
        @value-changed="radioGroupValueChanged($event)"
      />
      <DxSelectBox
        :items="positions"
        :input-attr="{ 'aria-label': 'Position' }"
        v-model:value="predefinedPosition"
        :visible="isPredefined"
      />
      <div class="section">
        <DxNumberBox
          :visible="!isPredefined"
          placeholder="top"
          v-model:value="coordinatePosition.top"
          width="48%"
          value-change-event="keyup"
          :disabled="!!coordinatePosition.bottom"
          :input-attr="{ 'aria-label': 'Position Top' }"
        />
        <DxNumberBox
          :visible="!isPredefined"
          placeholder="bottom"
          v-model:value="coordinatePosition.bottom"
          width="48%"
          value-change-event="keyup"
          :disabled="!!coordinatePosition.top"
          :input-attr="{ 'aria-label': 'Position Bottom' }"
        />
      </div>
      <div class="section">
        <DxNumberBox
          :visible="!isPredefined"
          placeholder="left"
          v-model:value="coordinatePosition.left"
          width="48%"
          value-change-event="keyup"
          :disabled="!!coordinatePosition.right"
          :input-attr="{ 'aria-label': 'Position Left' }"
        />
        <DxNumberBox
          :visible="!isPredefined"
          placeholder="right"
          v-model:value="coordinatePosition.right"
          width="48%"
          value-change-event="keyup"
          :disabled="!!coordinatePosition.left"
          :input-attr="{ 'aria-label': 'Position Right' }"
        />
      </div>
      <div>Direction</div>
      <DxSelectBox
        :items="directions"
        :input-attr="{ 'aria-label': 'Direction' }"
        v-model:value="direction"
      />
      <div class="section">
        <DxButton
          text="Show"
          width="48%"
          @click="show()"
        />
        <DxButton
          text="Hide all"
          width="48%"
          @click="hideAll()"
        />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import DxButton from 'devextreme-vue/button';
import DxRadioGroup from 'devextreme-vue/radio-group';
import DxSelectBox from 'devextreme-vue/select-box';
import DxNumberBox from 'devextreme-vue/number-box';
import notify from 'devextreme/ui/notify';
import hideToasts from 'devextreme/ui/toast/hide_toasts';

const types = ['error', 'info', 'success', 'warning'];
const positions = [
  'top left', 'top center', 'top right',
  'bottom left', 'bottom center', 'bottom right',
  'left center', 'center', 'right center',
] as const;
const directions = [
  'down-push', 'down-stack', 'up-push', 'up-stack',
  'left-push', 'left-stack', 'right-push', 'right-stack',
] as const;
let id = 1;
const isPredefined = ref(true);
const predefinedPosition = ref<typeof positions[number]>('bottom center');
const coordinatePosition = ref({
  top: undefined,
  bottom: undefined,
  left: undefined,
  right: undefined,
});
const direction = ref<typeof directions[number]>('up-push');

function show() {
  const newPosition = isPredefined.value ? predefinedPosition.value : coordinatePosition.value;
  const newDirection = direction.value;

  notify({
    message: `Toast ${id}`,
    height: 45,
    width: 150,
    minWidth: 150,
    type: types[Math.floor(Math.random() * 4)],
    displayTime: 3500,
    animation: {
      show: {
        type: 'fade', duration: 400, from: 0, to: 1,
      },
      hide: { type: 'fade', duration: 40, to: 0 },
    },
  },
  { position: newPosition, direction: newDirection });
  id += 1;
}
function hideAll() {
  hideToasts();
}
function radioGroupValueChanged({ value }) {
  isPredefined.value = value === 'predefined';
}
</script>
<style>
.options {
  padding: 20px;
  background-color: rgba(191, 191, 191, 0.15);
  position: absolute;
  right: 0;
  top: 0;
  width: 260px;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.section {
  width: 100%;
  display: flex;
  justify-content: space-between;
}
</style>
