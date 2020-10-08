<template>
  <div>
    <DxToolbar :items="toolbarContent"/>
    <DxDrawer
      :opened-state-mode="selectedOpenMode"
      :position="selectedPosition"
      :reveal-mode="selectedRevealMode"
      v-model:opened="openState"
      :height="400"
      :close-on-outside-click="true"
      template="listMenu"
    >
      <template #listMenu="{ data }">
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
</template>
<script>

import DxDrawer from 'devextreme-vue/drawer';
import DxRadioGroup from 'devextreme-vue/radio-group';
import DxToolbar from 'devextreme-vue/toolbar';
import NavigationList from './NavigationList.vue';
import { text } from './data.js';

export default {
  components: {
    DxDrawer,
    DxRadioGroup,
    DxToolbar,
    NavigationList
  },
  data() {
    return {
      text,
      showModes: ['push', 'shrink', 'overlap'],
      positionModes: ['top', 'bottom'],
      showSubmenuModes: ['slide', 'expand'],
      selectedOpenMode: 'shrink',
      selectedPosition: 'top',
      selectedRevealMode: 'expand',
      openState: false,
      toolbarContent: [{
        widget: 'dxButton',
        location: 'before',
        options: {
          icon: 'menu',
          onClick: () => this.openState = !this.openState
        }
      }]
    };
  }
};
</script>
<style scoped>
    .dx-toolbar {
        background-color: rgba(191, 191, 191, .15);
        padding: 5px 10px;
    }

    .dx-list-item-icon-container, .dx-toolbar-before {
        width: 36px;
        padding-right: 0px !important;
        text-align: center;
    }

    .dx-list-item-content {
        padding-left: 10px !important;
    }

    .dx-button {
        background-color: rgba(191, 191, 191, -0.15);
        border: none;
    }

    .dx-drawer-shrink #content {
        overflow: hidden;
        transition: all 0.4s ease-out;
        column-width: 900px;
    }

    .dx-drawer-shrink.dx-drawer-opened #content {
        column-width: 300px;
        margin-right: -10px;
    }

    .panel-list {
        height: 200px;
    }

    .panel-list .dx-list-item {
        color: #fff;
        text-align: center;
        border-top: 1px solid rgba(221, 221, 221, .2);
    }

    .options {
        padding: 20px;
        background-color: rgba(191, 191, 191, .15);
    }

    .caption {
        font-size: 18px;
        font-weight: 500;
    }

    .option {
        margin-top: 10px;
        display: inline-block;
        margin-right: 54px;
    }

    label {
        font-weight: bold;
    }

    #content {
        height: 100%;
        padding: 10px 20px;
    }

    #content h2 {
        font-size: 26px;
    }
</style>
