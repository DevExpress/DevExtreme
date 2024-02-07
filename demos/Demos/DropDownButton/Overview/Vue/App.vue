<template>
  <div>
    <div class="dx-fieldset">
      <div class="dx-fieldset-header">Single usage</div>
      <div class="dx-field">
        <div class="dx-field-label">
          Custom static text
        </div>
        <div class="dx-field-value">
          <DxDropDownButton
            :items="data.downloads"
            :drop-down-options="{ width: 230 }"
            text="Download Trial"
            icon="save"
            @item-click="onItemClick"
          />
        </div>
      </div>

      <div class="dx-field">
        <div class="dx-field-label">
          Custom main button action
        </div>
        <div class="dx-field-value">
          <DxDropDownButton
            :split-button="true"
            :use-select-mode="false"
            :items="data.profileSettings"
            text="Sandra Johnson"
            icon="../../../../images/gym/coach-woman.png"
            display-expr="name"
            key-expr="id"
            @button-click="onButtonClick"
            @item-click="onItemClick"
          />
        </div>
      </div>
    </div>
    <div class="dx-fieldset">
      <div class="dx-fieldset-header">Usage in a toolbar</div>
      <div class="dx-field">
        <DxToolbar :items="toolbarItems">
          <template #fontItem="{ data }">
            <div :style="{ fontSize: data.size + 'px'}">
              {{ data.text }}
            </div>
          </template>

          <template #colorpicker="{ data }">
            <div class="custom-color-picker">
              <i
                v-for="(itemColor, i) in data"
                :key="i"
                :class="itemColor ?
                  'color dx-icon dx-icon-square' :
                  'color dx-icon dx-icon-square dx-theme-text-color'"
                :style="{ color: itemColor }"
                @click="onColorClick(itemColor)"
              />
            </div>
          </template>
        </DxToolbar>
      </div>
      <div class="dx-field">
        <p
          id="text"
          :style="{
            textAlign: alignment,
            fontSize: fontSize,
            color: color,
            lineHeight: lineHeight
          }"
        >Lorem ipsum dolor sit amet, consectetur adipiscing elit,
          sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
          nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
          Excepteur sint occaecat cupidatat non proident,
          sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import DxDropDownButton from 'devextreme-vue/drop-down-button';
import DxToolbar from 'devextreme-vue/toolbar';
import notify from 'devextreme/ui/notify';
import service from './data.ts';
import 'whatwg-fetch';

const alignment = ref('left');
const color = ref(null);
const fontSize = ref('14px');
const lineHeight = ref(1.35);
let colorPicker;
const data = service.getData();
const toolbarItems = [
  {
    location: 'before',
    widget: 'dxDropDownButton',
    options: {
      displayExpr: 'name',
      keyExpr: 'id',
      selectedItemKey: 3,
      width: 125,
      stylingMode: 'text',
      useSelectMode: true,
      onSelectionChanged: (e) => {
        alignment.value = e.item.name.toLowerCase();
      },
      items: data.alignments,
    },
  },
  {
    location: 'before',
    widget: 'dxDropDownButton',
    options: {
      items: data.colors,
      onInitialized: ({ component }) => {
        colorPicker = component;
      },
      icon: 'square',
      stylingMode: 'text',
      dropDownOptions: { width: 'auto' },
      dropDownContentTemplate: 'colorpicker',
    },
  },
  {
    location: 'before',
    widget: 'dxDropDownButton',
    options: {
      stylingMode: 'text',
      displayExpr: 'text',
      keyExpr: 'size',
      useSelectMode: true,
      items: data.fontSizes,
      selectedItemKey: 14,
      onSelectionChanged: (e) => {
        fontSize.value = `${e.item.size}px`;
      },
      itemTemplate: 'fontItem',
    },
  },
  {
    location: 'before',
    widget: 'dxDropDownButton',
    options: {
      stylingMode: 'text',
      icon: 'indent',
      displayExpr: 'text',
      keyExpr: 'lineHeight',
      useSelectMode: true,
      items: data.lineHeights,
      selectedItemKey: 1.35,
      onSelectionChanged: (e) => {
        lineHeight.value = e.item.lineHeight;
      },
    },
  },
];

function onButtonClick(e) {
  notify(`Go to ${e.component.option('text')}'s profile`, 'success', 600);
}
function onItemClick(e) {
  notify(e.itemData.name || e.itemData, 'success', 600);
}
function onColorClick(clickedColor) {
  color.value = clickedColor;
  colorPicker.element().getElementsByClassName('dx-icon-square')[0].style.color = clickedColor;
  colorPicker.close();
}
</script>
<style scoped>
  .demo-container .dx-fieldset:first-child {
    width: 500px;
  }

  .dx-popup-content > .dx-template-wrapper.custom-color-picker {
    width: 82px;
    padding: 5px;
  }

  .dx-button-content img.dx-icon {
    width: 24px;
    height: 24px;
  }

  .color {
    cursor: pointer;
    font-size: 18px;
  }
</style>
