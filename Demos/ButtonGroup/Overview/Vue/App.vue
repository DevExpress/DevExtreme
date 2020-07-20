<template>
  <div>
    <div class="buttongroups-container">
      <DxButtonGroup
        :items="alignments"
        :selected-item-keys="['left']"
        key-expr="alignment"
        styling-mode="outlined"
        @item-click="itemClick"
      />
      <DxButtonGroup
        :items="fontStyles"
        key-expr="style"
        styling-mode="outlined"
        selection-mode="multiple"
        @item-click="itemClick"
      />
    </div>
    <div class="buttongroups-container">
      <DxButtonGroup
        :items="alignments"
        :selected-item-keys="['left']"
        key-expr="alignment"
        styling-mode="text"
        @item-click="itemClick"
      />
      <DxButtonGroup
        :items="fontStyles"
        class="multiple-selection-styling-mode"
        key-expr="style"
        styling-mode="text"
        selection-mode="multiple"
        @item-click="itemClick"
      />
    </div>
  </div>
</template>
<script>
import DxButtonGroup from 'devextreme-vue/button-group';
import { alignments, fontStyles } from './data.js';
import notify from 'devextreme/ui/notify';

export default {
  components: {
    DxButtonGroup
  },
  data() {
    return {
      alignments,
      fontStyles
    };
  },
  methods: {
    itemClick(e) {
      notify({ message: `The "${ e.itemData.hint }" button was clicked`, width: 320 }, 'success', 1000);
    }
  }
};
</script>
<style scoped>
  .buttongroups-container {
    display: flex;
    justify-content: center;
    font-size: 16px;
  }

  .buttongroups-container > div {
    padding: 0 12px;
  }

  .buttongroups-container:first-child {
    margin-top: 120px;
    margin-bottom: 40px;
  }

  .multiple-selection-styling-mode {
    border-left-width: 1px;
    border-left-style: solid;
    border-color: #dddddd;
  }
</style>
