<template>
  <div class="app-container">
    <DxList
      id="list"
      :items="contacts"
      @item-click="showActionSheet"
    >
      <template #item="{ data }">
        <ContactItem :item-data="data"/>
      </template>
    </DxList>
    <DxActionSheet
      :items="actionSheetItems"
      v-model:visible="isActionSheetVisible"
      v-model:target="actionSheetTarget"
      :use-popover="true"
      title="Choose action"
      @itemClick="showClickNotification($event.itemData.text)"
    />
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import DxActionSheet from 'devextreme-vue/action-sheet';
import DxList from 'devextreme-vue/list';
import notify from 'devextreme/ui/notify';
import { actionSheetItems, contacts } from './data.js';
import ContactItem from './ContactItem.vue';

const isActionSheetVisible = ref(false);
const actionSheetTarget = ref('');

function showActionSheet(e) {
  actionSheetTarget.value = e.itemElement;
  isActionSheetVisible.value = true;
}
function showClickNotification(buttonName) {
  notify(`The "${buttonName}" button is clicked.`);
}
</script>
