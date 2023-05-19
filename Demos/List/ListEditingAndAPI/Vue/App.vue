<template>
  <div id="list-api-demo">
    <div class="widget-container">
      <DxList
        :data-source="tasks"
        :height="400"
        :allow-item-deleting="allowDeletion"
        :item-delete-mode="itemDeleteMode"
      />
    </div>
    <div class="options">
      <div class="caption">Options</div>
      <div class="option">
        <DxCheckBox
          v-model:value="allowDeletion"
          text="Allow deletion"
        />
      </div>
      <div class="option">
        <span>Item delete mode </span>
        <DxSelectBox
          :disabled="!allowDeletion"
          :input-attr="{ 'aria-label': 'Delete Mode' }"
          :items="['static', 'toggle', 'slideButton', 'slideItem', 'swipe', 'context']"
          v-model:value="itemDeleteMode"
        />
      </div>
    </div>
  </div>
</template>
<script>

import DxSelectBox from 'devextreme-vue/select-box';
import DxCheckBox from 'devextreme-vue/check-box';
import DxList from 'devextreme-vue/list';

import { tasks } from './data.js';

export default {
  components: {
    DxSelectBox,
    DxCheckBox,
    DxList,
  },
  data() {
    return {
      tasks,
      allowDeletion: false,
      itemDeleteMode: 'toggle',
    };
  },
};
</script>
<style>
.options {
  margin-top: 20px;
  padding: 20px;
  background: rgba(191, 191, 191, 0.15);
}

.options .caption {
  font-size: 18px;
  font-weight: 500;
}

.option {
  margin-top: 10px;
}

.option > span {
  margin-right: 10px;
}

.option > .dx-selectbox {
  display: inline-block;
  vertical-align: middle;
  max-width: 350px;
  width: 100%;
}

</style>
