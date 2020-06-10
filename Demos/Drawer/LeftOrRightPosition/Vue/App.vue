<template>
  <div>
    <DxToolbar :items="toolbarContent"/>
    <DxDrawer
      :opened-state-mode="selectedOpenMode"
      :position="selectedPosition"
      :reveal-mode="selectedRevealMode"
      :opened.sync="openState"
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
          v-model="selectedOpenMode"
          :items="showModes"
          layout="horizontal"
        />
      </div>
      <div class="option">
        <label>Position</label>
        <DxRadioGroup
          v-model="selectedPosition"
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
          v-model="selectedRevealMode"
          :items="showSubmenuModes"
          layout="horizontal"
        />
      </div>
    </div>
  </div>
</template>
<script>

import { DxDrawer, DxRadioGroup, DxToolbar } from 'devextreme-vue';
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
      positionModes: ['left', 'right'],
      showSubmenuModes: ['slide', 'expand'],
      selectedOpenMode: 'shrink',
      selectedPosition: 'left',
      selectedRevealMode: 'slide',
      openState: true,
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

    .panel-list {
        height: 400px;
    }

    .dx-drawer-expand.dx-drawer-right .panel-list {
        float: right;
    }

    .panel-list .dx-list-item {
        color: #fff;
        border-top: 1px solid rgba(221, 221, 221, .2);
    }

    .panel-list .dx-list-item .dx-icon {
        color: #fff !important;
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
        margin-right: 50px;
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
