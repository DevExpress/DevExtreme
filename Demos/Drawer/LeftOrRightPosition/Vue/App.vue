<template>
  <div class="flex-container">
    <DxToolbar
      :items="toolbarContent"
      id="toolbar"
      class="dx-theme-background-color"
    />
    <DxDrawer
      :opened-state-mode="selectedOpenMode"
      :position="selectedPosition"
      :reveal-mode="selectedRevealMode"
      v-model:opened="openState"
      :height="400"
      :close-on-outside-click="true"
      template="listMenu"
    >
      <template #listMenu>
        <NavigationList/>
      </template>
      <div
        id="content"
        class="dx-theme-background-color"
        v-html="text"
      />
    </DxDrawer>
    <div class="options">
      <div class="caption">Options</div>
      <div class="options-container">
        <div class="option">
          <label>Opened state mode</label>
          <DxRadioGroup
            v-model:value="selectedOpenMode"
            :items="showModes"
            layout="horizontal"
          />
        </div>
        <div class="option">
          <label>Position</label>
          <DxRadioGroup
            v-model:value="selectedPosition"
            :items="positionModes"
            layout="horizontal"
          />
        </div>
        <div
          v-if="selectedOpenMode !== 'push'"
          class="option"
        >
          <label>Reveal mode</label>
          <DxRadioGroup
            v-model:value="selectedRevealMode"
            :items="showSubmenuModes"
            layout="horizontal"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import DxDrawer from 'devextreme-vue/drawer';
import DxRadioGroup from 'devextreme-vue/radio-group';
import DxToolbar from 'devextreme-vue/toolbar';
import NavigationList from './NavigationList.vue';
import { text } from './data.js';

const showModes = ['push', 'shrink', 'overlap'];
const positionModes = ['left', 'right'];
const showSubmenuModes = ['slide', 'expand'];
const selectedOpenMode = ref('shrink');
const selectedPosition = ref('left');
const selectedRevealMode = ref('slide');
const openState = ref(true);
const toolbarContent = [{
  widget: 'dxButton',
  location: 'before',
  options: {
    icon: 'menu',
    onClick: () => { openState.value = !openState.value; },
  },
}];
</script>
<style scoped>
    .flex-container {
      overflow: visible;
      display: flex;
      flex-direction: column;
    }

    .dx-drawer-content {
      display: flex;
    }

    #toolbar {
      box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.12), 0 2px 2px 0 rgba(0, 0, 0, 0.08);
      padding: 5px 10px;
      z-index: 10000;
    }

    .panel-list {
      height: 400px;
      padding-top: 12px;
    }

    .dx-drawer-expand.dx-drawer-right .panel-list {
      float: right;
    }

    .panel-list .dx-list-item {
      border-top: 1px solid rgba(221, 221, 221, 0.2);
    }

    .options {
      padding: 20px;
      background-color: rgba(191, 191, 191, 0.15);
    }

    .options-container {
      display: flex;
      align-items: center;
    }

    .caption {
      font-size: 18px;
      font-weight: 500;
    }

    .option {
      margin-top: 10px;
      display: inline-block;
      margin-right: 50px;
    }

    label {
      font-weight: bold;
    }

    #content {
      padding: 0 24px;
    }

    #content h2 {
      font-size: 26px;
    }
</style>
