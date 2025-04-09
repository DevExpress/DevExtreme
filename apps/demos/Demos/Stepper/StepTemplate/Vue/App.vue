<template>
  <div id="label-customStepShape" class="stepper-label">Custom Step Shape</div>
  <DxStepper
    id="customStepShape"
    :data-source="steps"
    :selected-index="2"
    :linear="false"
    :element-attr="{ 'aria-labelledby': 'label-customStepShape' }"
  >
    <template #item="{ data }">
      <div>
        <div class="dx-step-indicator">
          <i :class="'dx-icon dx-icon-' + data.icon"></i>
        </div>
        <div class="dx-step-label">
          <div class="dx-step-title">{{ data.title }}</div>
          <div v-if="data.optional" class="dx-step-optional-mark">(Optional)</div>
        </div>
      </div>
    </template>
  </DxStepper>
  <div id="label-titleOnly" class="stepper-label">Title Only</div>
  <DxStepper
    id="titleOnly"
    :data-source="steps"
    :selected-index="2"
    :linear="false"
    :element-attr="{ 'aria-labelledby': 'label-titleOnly' }"
  >
    <template #item="{ data }">
      <div>
        <div class="dx-step-label">
          <div class="dx-step-title">{{ data.title }}</div>
        </div>
      </div>
    </template>
  </DxStepper>
  <div id="label-iconOnly" class="stepper-label">Icon Only</div>
  <DxStepper
    id="iconOnly"
    :data-source="steps"
    :selected-index="2"
    :linear="false"
    :element-attr="{ 'aria-labelledby': 'label-iconOnly' }"
  >
    <template #item="{ data }">
      <div>
        <i :class="'dx-icon dx-icon-' + data.icon"></i>
      </div>
    </template>
  </DxStepper>
</template>

<script setup lang="ts">
import DxStepper from 'devextreme-vue/stepper';
import { steps } from './data.ts';
</script>

<style scoped>
#app {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  row-gap: 16px;
  height: 760px;
  min-width: 320px;
}

.stepper-label {
  font-weight: 600;
}

#customStepShape {
  margin-bottom: 64px;
}

#customStepShape .dx-step-indicator {
  border-radius: 4px;
}

#titleOnly {
  margin-bottom: 64px;
  align-items: center;
}

#titleOnly .dx-step {
  padding-inline: 2px;
}

#titleOnly .dx-step-content {
  padding-block: 4px;
}

#titleOnly .dx-step-label {
  width: auto;
  max-width: 100%;
}

#titleOnly .dx-step-title {
  background-color: var(--dx-color-main-bg);
  padding-inline: 8px;
}

#titleOnly .dx-step.dx-state-focused .dx-step-label {
  box-shadow: 0 0 0 2px var(--dx-color-main-bg), 0 0 0 4px var(--dx-color-primary), 0 0 0 8px var(--dx-color-main-bg);
  border-radius: 4px;
}

#iconOnly {
  align-items: center;
}

#iconOnly .dx-step-content {
  margin-block: 4px;
}

#iconOnly .dx-icon {
  padding: 6px;
  background-color: var(--dx-color-main-bg);
}

#iconOnly .dx-state-focused .dx-icon {
  box-shadow: 0 0 0 2px var(--dx-color-primary), 0 0 0 6px var(--dx-color-main-bg);
  border-radius: 4px;
}

#iconOnly :is(.dx-step-selected, .dx-step-completed) .dx-icon {
  color: var(--dx-color-primary);
}
</style>
