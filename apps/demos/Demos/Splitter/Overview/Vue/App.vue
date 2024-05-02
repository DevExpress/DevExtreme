<template>
  <DxSplitter class="splitter">
    <DxItem
      :resizable="true"
      size="140px"
      min-size="70px"
      text="Left Pane"
      template="paneContent"
      tabindex="0"
    />
    <DxItem>
      <DxSplitter orientation="vertical">
        <DxItem
          :resizable="true"
          :collapsible="true"
          max-size="75%"
          text="Central Pane"
          template="paneContent"
      tabindex="0"
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
      tabindex="0"
            />
            <DxItem
              :resizable="true"
              text="Nested Central Pane"
              template="paneContent"
      tabindex="0"
            />
            <DxItem
              :resizable="true"
              :collapsible="true"
              size="30%"
              min-size="5%"
              text="Nested Right Pane"
              template="paneContent"
      tabindex="0"
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
      tabindex="0"
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
import PaneContent from './PaneContent.vue';
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

  #splitter > .dx-splitter-item:first-child > .dx-splitter-item-content:focus {
    border-top-left-radius: 8px;
    border-bottom-left-radius: 8px;
  }

  #splitter > .dx-splitter-item:last-child > .dx-splitter-item-content:focus {
      border-top-right-radius: 8px;
      border-bottom-right-radius: 8px;
  }

  .dx-splitter-item-content:focus {
      outline: none;
      box-shadow: inset 0 0 0 1px var(--dx-color-primary);
  }
</style>
