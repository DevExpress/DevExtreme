<!-- eslint-disable no-restricted-syntax -->
<template>
  <DxSplitter class="splitter" orientation="horizontal">
    <DxItem
      :resizable="true"
      min-size="60px"
      size="140px"
      text="Left Pane"
      template="paneContent"
    />
    <DxItem>
      <DxSplitter orientation="vertical">
        <DxItem
          :resizable="true"
          :collapsible="true"
          min-size="60px"
          text="Center Pane"
          template="paneContent"
        />
        <DxItem :collapsible="true">
          <DxSplitter orientation="horizontal">
            <DxItem
              :resizable="true"
              size="33.3%"
              min-size="10px"
              text="Nested Left Pane"
              template="paneContent"
            />
            <DxItem
              :resizable="true"
              :collapsible="true"
              size="33.3%"
              min-size="10px"
              text="Nested Center Pane"
              template="paneContent"
            />
            <DxItem
              :resizable="true"
              :collapsible="true"
              min-size="10px"
              text="Nested Right Pane"
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
      text="Right Pane"
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
  .demo-container {
    height: 500px;
  }
  #app {
    height: 100%;
  }
  .splitter {
    border: 1px solid var(--dx-color-border);
    border-radius: 8px;
    overflow: hidden;
  }
</style>
