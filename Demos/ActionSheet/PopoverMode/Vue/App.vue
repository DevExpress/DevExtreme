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
<script>
import DxActionSheet from 'devextreme-vue/action-sheet';
import DxList from 'devextreme-vue/list';
import notify from 'devextreme/ui/notify';

import { actionSheetItems, contacts } from './data.js';
import ContactItem from './ContactItem.vue';

export default {
  components: {
    DxActionSheet,
    DxList,
    ContactItem
  },
  data() {
    return {
      actionSheetItems,
      contacts,
      isActionSheetVisible: false,
      actionSheetTarget: ''
    };
  },
  methods: {
    showActionSheet(e) {
      this.actionSheetTarget = e.itemElement;
      this.isActionSheetVisible = true;
    },
    showClickNotification(buttonName) {
      notify(`The "${buttonName}" button is clicked.`);
    }
  }
};
</script>
