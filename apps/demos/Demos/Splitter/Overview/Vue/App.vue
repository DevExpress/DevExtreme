<!-- eslint-disable no-restricted-syntax -->
<template>
  <DxSplitter class="splitter">
    <DxItem
      :resizable="true"
      min-size="70px"
      size="140px"
      text="Left Pane"
      template="paneContent"
    />
    <DxItem>
      <DxSplitter orientation="vertical">
        <DxItem
          :resizable="true"
          :collapsible="true"
          max-size="75%"
          text="Central Pane"
          template="paneContent"
        />
        <DxItem :collapsible="true">
          <DxSplitter>
            <DxItem
              :resizable="true"
              :collapsible="true"
              size="30%"
              min-size="5%"
              text="Nested Left Pane"
              template="paneContent"
            />
            <DxItem
              :resizable="true"
              text="Nested Central Pane"
              template="paneContent"
            />
            <DxItem
              :resizable="true"
              :collapsible="true"
              size="30%"
              min-size="5%"
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
      :resizable="false"
      :collapsible="false"
      size="140px"
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
