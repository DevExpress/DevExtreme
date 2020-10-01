<template>
  <div>
    <DxActionSheet
      :data-source="dataSource"
      v-model:visible="isActionSheetVisible"
      :show-title="showTitle"
      :show-cancel-button="showCancelButton"
      title="Choose action"
      @cancelClick="showClickNotification('Cancel')"
      @itemClick="showClickNotification($event.itemData.text)"
    />
    <div class="button">
      <DxButton
        width="100%"
        text="Click to show Action Sheet"
        @click="showActionSheet"
      />
    </div>
    <div class="options">
      <div class="caption">Options</div>
      <div class="option">
        <span>Show title</span>
        <DxSwitch v-model:value="showTitle"/>
      </div>
      <div class="option">
        <span>Show cancel button</span>
        <DxSwitch v-model:value="showCancelButton"/>
      </div>
    </div>
  </div>
</template>
<script>
import DxActionSheet from 'devextreme-vue/action-sheet';
import DxSwitch from 'devextreme-vue/switch';
import DxButton from 'devextreme-vue/button';
import { actionSheetItems } from './data.js';
import notify from 'devextreme/ui/notify';

export default {
  components: {
    DxActionSheet,
    DxButton,
    DxSwitch
  },
  data() {
    return {
      dataSource: actionSheetItems,
      isActionSheetVisible: false,
      showTitle: true,
      showCancelButton: true
    };
  },
  methods: {
    showActionSheet() {
      this.isActionSheetVisible = true;
    },
    showClickNotification(buttonName) {
      notify(`The "${buttonName}" button is clicked.`);
    }
  }
};
</script>

