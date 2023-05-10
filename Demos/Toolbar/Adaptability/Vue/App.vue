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
          >
            <DxButton
              icon="undo"
              :on-click="onUndoButtonClick"
            />
          </DxItem>

          <DxItem
            location="before"
            widget="dxButton"
          >
            <DxButton
              icon="redo"
              :on-click="onRedoButtonClick"
            />
          </DxItem>

          <DxItem
            location="before"
            locate-in-menu="auto"
            template="separatorTemplate"
            menu-item-template="menuSeparatorTemplate"
          />

          <DxItem
            location="before"
            locate-in-menu="auto"
          >
            <DxDropDownButton
              width="100%"
              display-expr="text"
              key-expr="size"
              item-template="fontSizeTemplate"
              :use-select-mode="true"
              :items="fontSizes"
              :selected-item-key="fontSize"
              :on-selection-changed="onFontSizeSelectionChanged"
            >
              <template #fontSizeTemplate="{ data }">
                <div :style="{ fontSize: data.size + 'px' }">
                  {{ data.text }}
                </div>
              </template>
            </DxDropDownButton>
          </DxItem>

          <DxItem
            location="before"
            locate-in-menu="auto"
          >
            <DxDropDownButton
              width="100%"
              icon="indent"
              display-expr="text"
              key-expr="lineHeight"
              :use-select-mode="true"
              :items="lineHeights"
              :selected-item-key="lineHeight"
              :on-selection-changed="onLineHeightSelectionChanged"
            />
          </DxItem>

          <DxItem
            location="before"
            locate-in-menu="auto"
          >
            <DxSelectBox
              placeholder="Font"
              display-expr="text"
              :input-attr="{ 'aria-label': 'Font' }"
              :data-source="fontFamilies"
              :on-item-click="onFontFamilyClick"
            />
          </DxItem>

          <DxItem
            location="before"
            locate-in-menu="auto"
            template="separatorTemplate"
            menu-item-template="menuSeparatorTemplate"
          />

          <DxItem location="before">
            <DxButtonGroup
              display-expr="text"
              key-expr="icon"
              styling-mode="outlined"
              selection-mode="multiple"
              :items="fontStyles"
              :on-item-click="onFontStyleItemClick"
            />
          </DxItem>

          <DxItem
            location="before"
            template="separatorTemplate"
          />

          <DxItem
            location="before"
            locate-in-menu="auto"
            template="textAlignTemplate"
            menu-item-template="textAlignMenuTemplate"
            widget="dxButtonGroup"
          />

          <DxItem location="before">
            <DxButtonGroup
              key-expr="alignment"
              styling-mode="outlined"
              :items="listTypes"
              :on-item-click="onListTypeButtonClick"
            />
          </DxItem>

          <DxItem
            location="before"
            locate-in-menu="auto"
            template="separatorTemplate"
            menu-item-template="menuSeparatorTemplate"
          />

          <DxItem
            location="before"
            locate-in-menu="auto"
          >
            <DxSelectBox
              display-expr="text"
              value-expr="text"
              :input-attr="{ 'aria-label': 'Text Style' }"
              :data-source="headings"
              :value="heading"
              :on-item-click="onHeadingClick"
            />
          </DxItem>

          <DxItem
            location="before"
            locate-in-menu="auto"
            template="separatorTemplate"
            menu-item-template="menuSeparatorTemplate"
          />

          <DxItem
            location="before"
            locate-in-menu="auto"
            show-text="inMenu"
            widget="dxButton"
          >
            <DxButton
              icon="link"
              text="Link"
              :on-click="onLinkButtonClick"
            />
          </DxItem>

          <DxItem
            location="before"
            locate-in-menu="auto"
            show-text="inMenu"
            widget="dxButton"
          >
            <DxButton
              icon="image"
              text="Add image"
              :on-click="onAddImageButtonClick"
            />
          </DxItem>

          <DxItem
            location="before"
            locate-in-menu="auto"
            template="separatorTemplate"
            menu-item-template="menuSeparatorTemplate"
          />

          <DxItem
            location="before"
            locate-in-menu="auto"
            show-text="inMenu"
            widget="dxButton"
          >
            <DxButton
              icon="clearformat"
              text="Clear formating"
              :on-click="onClearButtonClick"
            />
          </DxItem>

          <DxItem
            location="before"
            locate-in-menu="auto"
            show-text="inMenu"
            widget="dxButton"
          >
            <DxButton
              icon="codeblock"
              text="Code block"
              :on-click="onCodeBlockButtonClick"
            />
          </DxItem>

          <DxItem
            location="before"
            locate-in-menu="auto"
            show-text="inMenu"
            widget="dxButton"
          >
            <DxButton
              icon="blockquote"
              text="Blockquote"
              :on-click="onQuoteButtonClick"
            />
          </DxItem>

          <DxItem
            location="before"
            locate-in-menu="auto"
            template="separatorTemplate"
            menu-item-template="menuSeparatorTemplate"
          />

          <DxItem
            location="after"
            widget="dxButton"
            show-text="inMenu"
          >
            <DxButton
              icon="attach"
              text="Attach"
              :on-click="onAttachButtonClick"
            />
          </DxItem>

          <DxItem
            locate-in-menu="always"
            widget="dxButton"
            show-text="inMenu"
          >
            <DxButton
              icon="help"
              text="About"
              :on-click="onAboutButtonClick"
            />
          </DxItem>

          <template #separatorTemplate>
            <div class="toolbar-separator"/>
          </template>

          <template #menuSeparatorTemplate>
            <div class="toolbar-menu-separator"/>
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

      <DxCheckBox
        v-model="multiline"
        text="Multiline mode"
      />
    </div>
  </div>
</template>

<script>
import DxCheckBox from 'devextreme-vue/check-box';
import DxToolbar, { DxItem } from 'devextreme-vue/toolbar';
import DxButton from 'devextreme-vue/button';
import DxButtonGroup from 'devextreme-vue/button-group';
import DxResizable from 'devextreme-vue/resizable';
import DxDropDownButton from 'devextreme-vue/drop-down-button';
import DxSelectBox from 'devextreme-vue/select-box';
import notify from 'devextreme/ui/notify';
import {
  fontSizes,
  lineHeights,
  fontFamilies,
  fontStyles,
  headings,
  textAlignItems,
  textAlignItemsExtended,
  listTypes,
} from './data.js';
import 'devextreme/ui/select_box';

const lineHeightDefault = lineHeights[1].lineHeight;
const textAlignDefault = [textAlignItems[0].alignment];
const fontSizeDefault = fontSizes[2].size;
const headingDefault = headings[0].text;

export default {
  components: {
    DxCheckBox,
    DxToolbar,
    DxButton,
    DxButtonGroup,
    DxItem,
    DxResizable,
    DxDropDownButton,
    DxSelectBox,
  },

  data() {
    return {
      multiline: true,
      lineHeight: lineHeightDefault,
      textAlign: textAlignDefault,
      fontSize: fontSizeDefault,
      heading: headingDefault,
      fontSizes,
      lineHeights,
      fontFamilies,
      fontStyles,
      listTypes,
      headings,
    };
  },

  computed: {
    textAlignItems() {
      return textAlignItems;
    },

    textAlignItemsExtended() {
      return textAlignItemsExtended;
    },
  },

  methods: {
    onTextAlignItemClick(e) {
      const { alignment, hint } = e.itemData;

      this.textAlign = alignment;

      this.onButtonClick(hint);
    },

    onButtonClick(name) {
      notify(`The "${name}" button has been clicked`);
    },

    onUndoButtonClick() {
      this.onButtonClick('Undo');
    },

    onRedoButtonClick() {
      this.onButtonClick('Redo');
    },

    onFontStyleItemClick(e) {
      this.onButtonClick(e.itemData.hint);
    },

    onListTypeButtonClick(e) {
      this.onButtonClick(e.itemData.hint);
    },

    onLinkButtonClick() {
      this.onButtonClick('Link');
    },

    onAddImageButtonClick() {
      this.onButtonClick('Add Image');
    },

    onClearButtonClick() {
      this.onButtonClick('Clear Formating');
    },

    onCodeBlockButtonClick() {
      this.onButtonClick('Code Block');
    },

    onQuoteButtonClick() {
      this.onButtonClick('Blockquote');
    },

    onAttachButtonClick() {
      this.onButtonClick('Attach');
    },

    onAboutButtonClick() {
      this.onButtonClick('About');
    },

    onSelectionChanged(name) {
      notify(`The "${name}" value has been changed`);
    },

    onFontSizeSelectionChanged() {
      this.onSelectionChanged('Font Size');
    },

    onLineHeightSelectionChanged() {
      this.onSelectionChanged('Line Height');
    },

    onHeadingClick() {
      notify('The "Heading" value has been changed');
    },

    onFontFamilyClick() {
      notify('The "Font Family" value has been changed');
    },
  },
};
</script>

<style>
.dx-resizable-handle::after {
  content: "";
  position: absolute;
  width: 9px;
  height: 36px;
  border: none;
  border-radius: 50px;
  background-color: #fff;
  box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.24);
}

.dx-resizable-handle-right::after {
  top: 50%;
  right: -5px;
  transform: translateY(-50%);
}

.dx-toolbar.dx-toolbar-multiline .dx-toolbar-item {
  margin-bottom: 5px;
}

.widget-container {
  margin-right: 10px;
}

.resizable-container {
  padding: 10px;
  height: 300px;
  border: 1px dotted #999;
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
