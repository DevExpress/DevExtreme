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
<script setup lang="ts">
import { ref } from 'vue';
import DxActionSheet from 'devextreme-vue/action-sheet';
import DxSwitch from 'devextreme-vue/switch';
import DxButton from 'devextreme-vue/button';
import notify from 'devextreme/ui/notify';
import { actionSheetItems } from './data.ts';

const dataSource = actionSheetItems;
const isActionSheetVisible = ref(false);
const showTitle = ref(true);
const showCancelButton = ref(true);

function showActionSheet() {
  isActionSheetVisible.value = true;
}
function showClickNotification(buttonName) {
  notify(`The "${buttonName}" button is clicked.`);
}
</script>

