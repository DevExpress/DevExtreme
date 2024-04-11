<template>
  <div>
    <div class="dx-fieldset">
      <div class="dx-fieldset-header">Standalone button</div>
      <div class="dx-field">
        <div class="dx-field-label">
          Text and icon
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
        <div class="dx-field-label">Custom template and actions</div>
        <div class="dx-field-value">
          <DxDropDownButton
            id="custom-template"
            :split-button="true"
            :use-select-mode="false"
            :items="data.profileSettings"
            display-expr="name"
            key-expr="id"
            @button-click="onButtonClick"
            @item-click="onItemClick"
            template="dropDownButtonTemplate"
          >
            <template #dropDownButtonTemplate="{ data }">
              <div class="button-img-container">
                <div class="button-img-indicator"/>
                <img
                  class="button-img"
                  :src="employeeImageUrl"
                  alt="employee"
                >
              </div>
              <div class="text-container">
                <div class="button-title">Olivia Peyton</div>
                <div class="button-row">IT Manager</div>
              </div>
            </template>
          </DxDropDownButton>
        </div>
      </div>
    </div>
    <div class="dx-fieldset">
      <div class="dx-fieldset-header">Embedded in a Toolbar</div>
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
                class="dx-icon dx-icon-square"
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

const employeeImageUrl = data.getEmployeeImageUrl();

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
  notify(`Go to ${e.element.querySelector('.button-title').textContent}'s profile`, 'success', 600);
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

  .color {
    cursor: pointer;
    font-size: 18px;
  }

  .text-container {
    padding-inline-start: 12px;
    padding-inline-end: 4px;
    display: flex;
    align-items: flex-start;
    flex-direction: column;
  }

  .button-img-container {
    position: relative;
    height: 32px;
  }

  .button-img {
    width: 32px;
    height: 32px;
    position: relative;
    border-width: 1px;
    border-style: solid;
    border-color: var(--dx-color-border);
    border-radius: 50%;
  }

  .button-img-indicator {
    position: absolute;
    background-color: var(--dx-color-danger);
    top: -1px;
    inset-inline-end: -1px;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    border-width: 2px;
    border-style: solid;
    border-color: var(--dx-color-main-bg);
    z-index: 1;
  }

  .button-title {
    line-height: 20px;
  }

  .button-row {
    font-size: 12px;
    line-height: 14px;
    opacity: 0.6;
  }

  #custom-template .dx-button {
    height: 46px;
  }

  #custom-template .dx-button.dx-dropdownbutton-action .dx-button-content {
    padding-inline-start: 12px;
    padding-inline-end: 12px;
  }
</style>
