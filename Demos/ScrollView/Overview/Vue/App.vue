<template>
  <div>
    <div id="scrollview-demo">
      <DxScrollView
        id="scrollview"
        ref="scrollViewWidget"
        :scroll-by-content="scrollByContent"
        :scroll-by-thumb="scrollByThumb"
        :show-scrollbar="showScrollbar"
        :bounce-enabled="pullDown"
        reach-bottom-text="Updating..."
        @pull-down="updateTopContent"
        @reach-bottom="updateBottomContent"
      >
        <div
          class="text-content"
          v-html="content"
        />
      </DxScrollView>
      <div class="options">
        <div class="caption">Options</div>
        <div class="option">
          <span>Show scrollbar: </span>
          <DxSelectBox
            id="show-scrollbar-mode"
            :items="showScrollbarModes"
            :input-attr="{ 'aria-label': 'Show Scrollbar Mode' }"
            v-model:value="showScrollbar"
            value-expr="value"
            display-expr="text"
          />
        </div>
        <div class="option">
          <DxCheckBox
            id="use-reach-bottom"
            :value="true"
            text="Update content on the ReachBottom event"
            @value-changed="onValueChanged"
          />
        </div>
        <div class="option">
          <DxCheckBox
            id="use-pull-down-bottom"
            v-model:value="pullDown"
            text="Update content on the PullDown event"
          />
        </div>
        <div class="option">
          <DxCheckBox
            v-model:value="scrollByContent"
            text="Scroll by content"
          />
        </div>
        <div class="option">
          <DxCheckBox
            v-model:value="scrollByThumb"
            text="Scroll by thumb"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import { DxScrollView } from 'devextreme-vue/scroll-view';
import { DxSelectBox } from 'devextreme-vue/select-box';
import { DxCheckBox } from 'devextreme-vue/check-box';
import { longText } from './data.js';

const content = ref(longText);
const pullDown = ref(false);
const showScrollbarModes = ref([
  {
    text: 'On Scroll',
    value: 'onScroll',
  },
  {
    text: 'On Hover',
    value: 'onHover',
  },
  {
    text: 'Always',
    value: 'always',
  },
  {
    text: 'Never',
    value: 'never',
  },
]);
const showScrollbar = ref('onScroll');
const scrollByContent = ref(true);
const scrollByThumb = ref(true);
const scrollViewWidget = ref();

let updateContentTimer;
function updateContent(args, eventName) {
  const updateContentText = `<br /><div>Content has been updated on the ${
    eventName
  } event.</div><br />`;
  if (updateContentTimer) clearTimeout(updateContentTimer);
  updateContentTimer = setTimeout(() => {
    content.value = eventName === 'PullDown'
      ? updateContentText + content.value
      : content.value + updateContentText;
    args.component.release();
  }, 500);
}
function updateBottomContent(e) {
  updateContent(e, 'ReachBottom');
}
function updateTopContent(e) {
  updateContent(e, 'PullDown');
}
function onValueChanged(args) {
  scrollViewWidget.value.instance.option(
    'onReachBottom',
    args.value ? updateBottomContent : null,
  );
}
</script>
<style scoped>
#scrollview-demo {
  min-height: 550px;
}

#scrollview {
  height: auto;
  position: absolute;
  top: 0;
  bottom: 300px;
  padding: 20px;
}

.options {
  padding: 20px;
  background-color: rgba(191, 191, 191, 0.15);
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
}

.caption {
  font-size: 18px;
  font-weight: 500;
}

.option {
  margin-top: 10px;
}

.option > span {
  position: relative;
  top: 2px;
  margin-right: 10px;
}

.text-content {
  white-space: pre-wrap;
}

.option > .dx-selectbox {
  display: inline-block;
  vertical-align: middle;
  max-width: 340px;
  width: 100%;
}
</style>
