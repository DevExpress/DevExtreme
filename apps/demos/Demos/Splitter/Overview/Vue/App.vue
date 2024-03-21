<!-- eslint-disable no-restricted-syntax -->
<template>
  <DxSplitter orientation="horizontal">
    <DxItem
      :resizable="true"
      min-size="60px"
      size="140px"
      :template="(data, index, element)=>myfunction(data, 1, element)"
    />
    <DxItem>
      <DxSplitter orientation="vertical">
        <DxItem
          :resizable="true"
          :collapsible="true"
          min-size="60px"
          :template="(data, index, element)=>myfunction(data, 2, element)"
        />
        <DxItem :collapsible="true">
          <DxSplitter orientation="horizontal">
            <DxItem
              :resizable="true"
              size="33.3%"
              min-size="10px"
              :template="(data, index, element)=>myfunction(data, 3, element)"
            />
            <DxItem
              :resizable="true"
              :collapsible="true"
              size="33.3%"
              min-size="10px"
              :template="(data, index, element)=>myfunction(data, 4, element)"
            />
            <DxItem
              :resizable="true"
              :collapsible="true"
              min-size="10px"
              :template="(data, index, element)=>myfunction(data, 5, element)"
            />
          </DxSplitter>
        </DxItem>
      </DxSplitter>
    </DxItem>
    <DxItem
      size="170px"
      min-size="60px"
      :template="(data, index, element)=>myfunction(data, 6, element)"
    />
  </DxSplitter>


</template>
<script setup lang="ts">
import { DxSplitter, DxItem } from 'devextreme-vue/splitter';

// eslint-disable-next-line spellcheck/spell-checker
const myfunction = (data, index, element) => {
  const fullText = document.createElement('div');
  fullText.textContent = '';
  fullText.classList.add('contentParent');

  const item = document.createElement('div');
  item.textContent = `Pane ${index}`;
  item.classList.add('paneClass');
  fullText.appendChild(item);

  const state = document.createElement('div');
  state.textContent = `${data.resizable ? 'Resizable ' : ''}${data.resizable && data.collapsible ? 'and' : ''}${data.collapsible ? ' Collapsible' : ''}`;
  state.classList.add('stateClass');
  fullText.appendChild(state);

  Object.keys(data).forEach((key) => {
    if (key !== 'template' && key !== 'resizable' && key !== 'collapsible') {
      const value = data[key];
      const config = document.createElement('div');
      config.textContent = `${key}: ${value}`;
      config.classList.add('optionClass');
      fullText.appendChild(config);
    }
  });

  element.appendChild(fullText);
};
</script>
<style scoped>
.demo-container #app {
  width: 860px;
  height: 460px;
  padding: 32px;
  position: relative;
}

#splitter{
  border: 1px solid rgba(0, 0, 0, 0.16);
  border-radius: 8px;
  position:relative;
  overflow: hidden;
}

.contentParent {
  padding: 12px;
}

.paneClass {
  font-family: "Arial";
}

.stateClass {
  font-family: "Arial";
  font-size: var(--dx-font-size-xs);
}

.optionClass {
  color: var(--dx-texteditor-color-label);
  font-size: 10px;
}
</style>
