<template>
  <div>
    <div class="widget-container">
      <DxResizable
        class="resizable-container"
        area=".widget-container"
        handles="right"
        :min-width="500"
        :min-height="150"
        :max-height="370"
      >
        <DxToolbar :multiline="multiline">
          <DxItem
            location="before"
            widget="dxButton"
            :options="undoButtonOptions"
          />
          <DxItem
            location="before"
            widget="dxButton"
            :options="redoButtonOptions"
          />
          <DxItem
            location="before"
            locate-in-menu="auto"
            template="separatorTemplate"
            menu-item-template="menuSeparatorTemplate"
          />
          <DxItem
            location="before"
            locate-in-menu="auto"
            widget="dxDropDownButton"
            :options="fontSizeOptions"
          />
          <DxItem
            location="before"
            locate-in-menu="auto"
            widget="dxDropDownButton"
            :options="lineHeightOptions"
          />
          <DxItem
            location="before"
            locate-in-menu="auto"
            widget="dxSelectBox"
            :options="fontFamilyOptions"
          />
          <DxItem
            location="before"
            locate-in-menu="auto"
            template="separatorTemplate"
            menu-item-template="menuSeparatorTemplate"
          />
          <DxItem
            location="before"
            widget="dxButtonGroup"
            :options="fontStyleOptions"
          />
          <DxItem
            location="before"
            template="separatorTemplate"
          />
          <DxItem
            css-class="dx-toolbar-hidden-button-group"
            location="before"
            locate-in-menu="auto"
            template="textAlignTemplate"
            menu-item-template="textAlignMenuTemplate"
          />
          <DxItem
            location="before"
            widget="dxButtonGroup"
            :options="listOptions"
          />
          <DxItem
            location="before"
            locate-in-menu="auto"
            template="separatorTemplate"
            menu-item-template="menuSeparatorTemplate"
          />
          <DxItem
            location="before"
            locate-in-menu="auto"
            widget="dxDateBox"
            :options="dateBoxOptions"
          />
          <DxItem
            location="before"
            locate-in-menu="auto"
            template="separatorTemplate"
            menu-item-template="menuSeparatorTemplate"
          />
          <DxItem
            location="before"
            locate-in-menu="auto"
            widget="dxCheckBox"
            :options="checkBoxOptions"
          />
          <DxItem
            location="after"
            widget="dxButton"
            show-text="inMenu"
            :options="attachButtonOptions"
          />
          <DxItem
            location="after"
            locate-in-menu="auto"
            widget="dxButton"
            show-text="inMenu"
            :options="addButtonOptions"
          />
          <DxItem
            location="after"
            locate-in-menu="auto"
            widget="dxButton"
            show-text="inMenu"
            :options="removeButtonOptions"
          />
          <DxItem
            locate-in-menu="always"
            widget="dxButton"
            show-text="inMenu"
            :options="aboutButtonOptions"
          />

          <template #separatorTemplate>
            <div class="toolbar-separator"/>
          </template>

          <template #menuSeparatorTemplate>
            <div class="toolbar-menu-separator"/>
          </template>

          <template #fontSizeTemplate="{ data }">
            <div :style="{ fontSize: data.size + 'px' }">{{ data.text }}</div>
          </template>

          <template #textAlignTemplate>
            <DxButtonGroup
              key-expr="alignment"
              styling-mode="outlined"
              :items="textAlignItems"
              :selected-item-keys="textAlign"
              @item-click="onTextAlignItemClick"
            />
          </template>

          <template #textAlignMenuTemplate>
            <DxButtonGroup
              :items="textAlignItemsExtended"
              display-expr="text"
              :selected-item-keys="textAlign"
              key-expr="alignment"
              styling-mode="outlined"
              @item-click="onTextAlignItemClick"
            />
          </template>
        </DxToolbar>
      </DxResizable>
    </div>

    <div class="options-container">
      <div class="caption">Options</div>

      <DxRadioGroup
        v-model="multiline"
        layout="horizontal"
        value-expr="value"
        :items="toolbarLineModes"
      />
    </div>
  </div>
</template>

<script>
import DxCheckBox from 'devextreme-vue/check-box';
import DxToolbar, { DxItem } from 'devextreme-vue/toolbar';
import DxButtonGroup from 'devextreme-vue/button-group';
import DxResizable from 'devextreme-vue/resizable';
import DxDropDownButton from 'devextreme-vue/drop-down-button';
import DxDateBox from 'devextreme-vue/date-box';
import DxSelectBox from 'devextreme-vue/select-box';
import DxRadioGroup from 'devextreme-vue/radio-group';
import notify from 'devextreme/ui/notify';
import {
  fontSizes,
  lineHeights,
  fontFamilies,
  fontStyles,
  textAlignItems,
  textAlignItemsExtended,
  listTypes,
} from './data.js';
import 'devextreme/ui/select_box';

const lineHeightDefault = lineHeights[1].lineHeight;
const textAlignDefault = [textAlignItems[0].alignment];
const fontSizeDefault = fontSizes[2].size;

export default {
  components: {
    DxCheckBox,
    DxToolbar,
    DxButtonGroup,
    DxItem,
    DxResizable,
    DxRadioGroup,
    DxDropDownButton,
    DxDateBox,
    DxSelectBox,
  },

  data() {
    return {
      multiline: true,
      lineHeight: lineHeightDefault,
      textAlign: textAlignDefault,
      fontSize: fontSizeDefault,
    };
  },

  computed: {
    toolbarLineModes() {
      return [
        {
          text: 'Multiline mode',
          value: true,
        },
        {
          text: 'Single-line mode',
          value: false,
        },
      ];
    },

    textAlignItems() {
      return textAlignItems;
    },

    textAlignItemsExtended() {
      return textAlignItemsExtended;
    },

    undoButtonOptions() {
      return {
        icon: 'undo',
        onClick: () => {
          this.onButtonClick('Undo');
        },
      };
    },

    redoButtonOptions() {
      return {
        icon: 'redo',
        onClick: () => {
          this.onButtonClick('Redo');
        },
      };
    },

    fontSizeOptions() {
      return {
        width: '100%',
        displayExpr: 'text',
        keyExpr: 'size',
        useSelectMode: true,
        items: fontSizes,
        itemTemplate: 'fontSizeTemplate',
        selectedItemKey: this.fontSize,
        onSelectionChanged: () => {
          this.onSelectionChanged('Font Size');
        },
      };
    },

    lineHeightOptions() {
      return {
        width: '100%',
        icon: 'indent',
        displayExpr: 'text',
        keyExpr: 'lineHeight',
        useSelectMode: true,
        items: lineHeights,
        selectedItemKey: this.lineHeight,
        onSelectionChanged: () => {
          this.onSelectionChanged('Line Height');
        },
      };
    },

    fontFamilyOptions() {
      return {
        placeholder: 'Font',
        displayExpr: 'text',
        dataSource: fontFamilies,
        onItemClick: () => {
          this.onFontFamilyClick();
        },
      };
    },

    fontStyleOptions() {
      return {
        displayExpr: 'text',
        items: fontStyles,
        keyExpr: 'icon',
        stylingMode: 'outlined',
        selectionMode: 'multiple',
        onItemClick: (e) => {
          this.onButtonClick(e.itemData.hint);
        },
      };
    },

    listOptions() {
      return {
        items: listTypes,
        keyExpr: 'alignment',
        stylingMode: 'outlined',
        onItemClick: (e) => {
          this.onButtonClick(e.itemData.hint);
        },
      };
    },

    dateBoxOptions() {
      return {
        width: 200,
        type: 'date',
        value: new Date(2022, 9, 7),
        onValueChanged: () => {
          this.onDateBoxValueChanged();
        },
      };
    },

    checkBoxOptions() {
      return {
        value: false,
        text: 'Navigation Pane',
        onOptionChanged: () => {
          this.onCheckBoxValueChanged();
        },
      };
    },

    attachButtonOptions() {
      return {
        icon: 'attach',
        text: 'Attach',
        onClick: () => {
          this.onButtonClick('Attach');
        },
      };
    },

    addButtonOptions() {
      return {
        icon: 'add',
        text: 'Add',
        onClick: () => {
          this.onButtonClick('Add');
        },
      };
    },

    removeButtonOptions() {
      return {
        icon: 'trash',
        text: 'Remove',
        onClick: () => {
          this.onButtonClick('Remove');
        },
      };
    },

    aboutButtonOptions() {
      return {
        icon: 'help',
        text: 'About',
        onClick: () => {
          this.onButtonClick('About');
        },
      };
    },
  },

  methods: {
    onTextAlignItemClick(e) {
      const { alignment, hint } = e.itemData;

      this.textAlign = alignment;

      this.onButtonClick(hint);
    },

    onButtonClick(name) {
      notify(`The "${name}" button was clicked`);
    },

    onSelectionChanged(name) {
      notify(`The "${name}" value was changed`);
    },

    onCheckBoxValueChanged() {
      notify('The "Navigation Pane" checkbox value was changed');
    },

    onDateBoxValueChanged() {
      notify('The "DateBox" value was changed');
    },

    onFontFamilyClick() {
      notify('The "Font Family" value was changed');
    },
  },
};
</script>

<style>
.dx-resizable-handle::after {
  content: "";
  background-color: #337ab7;
  position: absolute;
  width: 12px;
  height: 12px;
  border: 1px solid #337ab7;
  top: 50%;
  transform: translateY(-7px);
}

.dx-resizable-handle-right::after {
  right: -7px;
}

.dx-toolbar.dx-toolbar-multiline .dx-toolbar-item {
  margin-bottom: 5px;
}

.dx-toolbar-menu-section .dx-selectbox {
  width: auto;
}

.widget-container {
  margin-right: 6px;
}

.resizable-container {
  padding: 10px;
  height: 300px;
  border: 1px dashed #dbdbdb;
  border-radius: 4px;
  box-sizing: border-box;
}

.options-container {
  margin-top: 20px;
  padding: 20px;
  background-color: rgba(191, 191, 191, 0.15);
  position: relative;
}

.caption {
  font-size: 18px;
  font-weight: 500;
  margin-bottom: 10px;
}

.toolbar-separator {
  height: 36px;
  margin: 0 5px;
  border-left: 1px solid #ddd;
}

.toolbar-menu-separator {
  height: 1px;
  border-bottom: 1px solid #ddd;
}
</style>
