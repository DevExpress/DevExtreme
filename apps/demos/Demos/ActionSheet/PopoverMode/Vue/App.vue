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
import DxList, { type DxListTypes } from 'devextreme-vue/list';
import notify from 'devextreme/ui/notify';
import { actionSheetItems, contacts } from './data.ts';
import ContactItem from './ContactItem.vue';
import { type DxElement } from 'devextreme/core/element';

const isActionSheetVisible = ref(false);
const actionSheetTarget = ref<DxElement>();

function showActionSheet(e: DxListTypes.ItemClickEvent) {
  actionSheetTarget.value = e.itemElement;
  isActionSheetVisible.value = true;
}
function showClickNotification(buttonName: string) {
  notify(`The "${buttonName}" button is clicked.`);
}
</script>
