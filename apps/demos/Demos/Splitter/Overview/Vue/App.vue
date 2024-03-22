<!-- eslint-disable no-restricted-syntax -->
<template>
  <DxSplitter class="splitter" orientation="horizontal">
    <DxItem
      :resizable="true"
      min-size="60px"
      size="140px"
      title="Left Pane"
      template="paneContent"
    />
    <DxItem>
      <DxSplitter orientation="vertical">
        <DxItem
          :resizable="true"
          :collapsible="true"
          min-size="60px"
          title="Central Pane"
          template="paneContent"
        />
        <DxItem :collapsible="true">
          <DxSplitter orientation="horizontal">
            <DxItem
              :resizable="true"
              size="33.3%"
              min-size="10px"
              title="Nested Left Pane"
              template="paneContent"
            />
            <DxItem
              :resizable="true"
              :collapsible="true"
              size="33.3%"
              min-size="10px"
              title="Nested Center Pane"
              template="paneContent"
            />
            <DxItem
              :resizable="true"
              :collapsible="true"
              min-size="10px"
              title="Nested Right Pane"
              template="paneContent"
            />
            <template #paneContent="{ data }">
              <PaneContent
                :data="data"
              />
            </template>
          </DxSplitter>
        </DxItem>
        <template #paneContent="{ data }">
          <PaneContent
            :data="data"
          />
        </template>
      </DxSplitter>
    </DxItem>
    <DxItem
      size="170px"
      min-size="60px"
      title="Right Pane"
      template="paneContent"
    />


    <template #paneContent="{ data }">
      <PaneContent
        :data="data"
      />
    </template>
  </DxSplitter>


</template>
<script setup lang="ts">
import { DxSplitter, DxItem } from 'devextreme-vue/splitter';
import PaneContent from './PaneContent.vue'
</script>
<style scoped>
.demo-container #app{
  width: 860px;
  height: 460px;
  padding: 32px;
  position: relative;
}

.splitter {
  border: 1px solid var(--dx-color-border);
  border-radius: 8px;
  position: relative;
  overflow: hidden;
}
.pane-content {
  padding: 12px;
}
.pane-title {
  font-weight: 600;
  margin-bottom: 2px;
}
.pane-state {
  font-size: var(--dx-font-size-xs);
  margin-bottom: 4px;
}
.pane-option {
  color: var(--dx-texteditor-color-label);
  font-size: 10px;
}

</style>
