<template>
  <DxFileManager
    ref="fileManager"
    :file-system-provider="fileItems"
    @context-menu-item-click="onItemClick"
    :height="450"
  >
    <DxPermissions
      :create="true"
      :copy="true"
      :move="true"
      :delete="true"
      :rename="true"
    />

    <DxItemView
      :show-parent-folder="false"
    >
      <DxDetails>
        <DxColumn data-field="thumbnail"/>
        <DxColumn data-field="name"/>
        <DxColumn
          data-field="category"
          caption="Category"
          :width="95"
        />
        <DxColumn data-field="dateModified"/>
        <DxColumn data-field="size"/>
      </DxDetails>
    </DxItemView>

    <DxToolbar>
      <DxItem
        name="showNavPane"
        :visible="true"
      />
      <DxItem name="separator"/>
      <DxItem name="create"/>
      <DxItem
        widget="dxMenu"
        location="before"
        :options="newFileMenuOptions"
      />
      <DxItem name="refresh"/>
      <DxItem
        name="separator"
        location="after"
      />
      <DxItem name="switchView"/>

      <DxFileSelectionItem name="rename"/>
      <DxFileSelectionItem name="separator"/>
      <DxFileSelectionItem name="delete"/>
      <DxFileSelectionItem name="separator"/>
      <DxFileSelectionItem
        widget="dxMenu"
        location="before"
        :options="changeCategoryMenuOptions"
      />
      <DxFileSelectionItem name="refresh"/>
      <DxFileSelectionItem name="clearSelection"/>
    </DxToolbar>
    <DxContextMenu>
      <DxItem name="create"/>
      <DxItem
        text="Create new file"
        icon="plus"
      >
        <DxItem text="Text Document"/>
        <DxItem text="RTF Document"/>
        <DxItem text="Spreadsheet"/>
      </DxItem>
      <DxItem
        name="rename"
        :begin-group="true"
      />
      <DxItem name="delete"/>
      <DxItem
        text="Category"
        icon="tags"
        :begin-group="true"
      >
        <DxItem text="Work"/>
        <DxItem text="Important"/>
        <DxItem text="Home"/>
        <DxItem text="None"/>
      </DxItem>
    </DxContextMenu>
  </DxFileManager>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import {
  DxFileManager, DxPermissions, DxToolbar, DxContextMenu, DxItem,
  DxFileSelectionItem, DxItemView, DxDetails, DxColumn,
} from 'devextreme-vue/file-manager';
import { fileItems, getItemInfo } from './data.ts';

const newFileMenuOptions = getNewFileMenuOptions();
const changeCategoryMenuOptions = getChangeCategoryMenuOptions();
const fileManager = ref();

function onItemClick({ itemData, viewArea, fileSystemItem }) {
  let updated = false;
  const { extension, category } = getItemInfo(itemData.text);

  if (extension) {
    updated = createFile(extension, fileSystemItem);
  } else if (category !== undefined) {
    updated = updateCategory(category, fileSystemItem, viewArea);
  }

  if (updated) {
    fileManager.value.instance.refresh();
  }
}

function createFile(fileExtension, directory = fileManager.value.instance.getCurrentDirectory()) {
  const newItem = {
    __KEY__: Date.now(),
    name: `New file${fileExtension}`,
    isDirectory: false,
    size: 0,
  };

  if (!directory.isDirectory) {
    return false;
  }

  let array = null;
  if (!directory.dataItem) {
    array = fileItems;
  } else {
    array = directory.dataItem.items;
    if (!array) {
      array = [];
      directory.dataItem.items = array;
    }
  }

  array.push(newItem);
  return true;
}
function updateCategory(newCategory, directory, viewArea) {
  let items = null;

  if (viewArea === 'navPane') {
    items = [directory];
  } else {
    items = fileManager.value.instance.getSelectedItems();
  }

  items.forEach((item) => {
    if (item.dataItem) {
      item.dataItem.category = newCategory;
    }
  });

  return items.length > 0;
}
function getNewFileMenuOptions() {
  return {
    items: [
      {
        text: 'Create new file',
        icon: 'plus',
        items: [
          {
            text: 'Text Document',
            options: {
              extension: '.txt',
            },
          },
          {
            text: 'RTF Document',
            options: {
              extension: '.rtf',
            },
          },
          {
            text: 'Spreadsheet',
            options: {
              extension: '.xls',
            },
          },
        ],
      },
    ],
    onItemClick,
  };
}
function getChangeCategoryMenuOptions() {
  return {
    items: [
      {
        text: 'Category',
        icon: 'tags',
        items: [
          {
            text: 'Work',
            options: {
              category: 'Work',
            },
          },
          {
            text: 'Important',
            options: {
              category: 'Important',
            },
          },
          {
            text: 'Home',
            options: {
              category: 'Home',
            },
          },
          {
            text: 'None',
            options: {
              category: '',
            },
          },
        ],
      },
    ],
    onItemClick,
  };
}
</script>
