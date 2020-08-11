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
        <DxItem
          text="Text Document"
          :options="{ extension: '.txt' }"
        />
        <DxItem
          text="RTF Document"
          :options="{ extension: '.rtf' }"
        />
        <DxItem
          text="Spreadsheet"
          :options="{ extension: '.xls' }"
        />
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
        <DxItem
          text="Work"
          :options="{ category: 'Work' }"
        />
        <DxItem
          text="Important"
          :options="{ category: 'Important' }"
        />
        <DxItem
          text="Home"
          :options="{ category: 'Home' }"
        />
        <DxItem
          text="None"
          :options="{ category: '' }"
        />
      </DxItem>
    </DxContextMenu>
  </DxFileManager>
</template>

<script>
import { DxFileManager, DxPermissions, DxToolbar, DxContextMenu, DxItem,
  DxFileSelectionItem, DxItemView, DxDetails, DxColumn } from 'devextreme-vue/file-manager';
import { fileItems } from './data.js';

export default {
  components: {
    DxFileManager,
    DxPermissions,
    DxToolbar,
    DxContextMenu,
    DxItem,
    DxFileSelectionItem,
    DxItemView,
    DxDetails,
    DxColumn
  },

  data() {
    return {
      fileItems,
      newFileMenuOptions: this.getNewFileMenuOptions(),
      changeCategoryMenuOptions: this.getChangeCategoryMenuOptions()
    };
  },
  methods: {
    onItemClick({ itemData, viewArea, fileSystemItem }) {
      let updated = false;
      const extension = itemData.options ? itemData.options.extension : undefined;
      const category = itemData.options ? itemData.options.category : undefined;

      if(extension) {
        updated = this.createFile(extension, fileSystemItem);
      } else if(category !== undefined) {
        updated = this.updateCategory(category, fileSystemItem, viewArea);
      }

      if(updated) {
        this.$refs.fileManager.instance.refresh();
      }
    },

    createFile(fileExtension, directory) {
      var newItem = {
        __KEY__: Date.now(),
        name: `New file${ fileExtension}`,
        isDirectory: false,
        size: 0
      };

      directory = directory || this.$refs.fileManager.instance.getCurrentDirectory();
      if(!directory.isDirectory) {
        return false;
      }

      var array = null;
      if(!directory.dataItem) {
        array = this.fileItems;
      }
      else {
        array = directory.dataItem.items;
        if(!array) {
          directory.dataItem.items = array = [];
        }
      }

      array.push(newItem);
      return true;
    },

    updateCategory(newCategory, directory, viewArea) {
      var items = null;

      if(viewArea === 'navPane') {
        items = [ directory ];
      } else {
        items = this.$refs.fileManager.instance.getSelectedItems();
      }

      items.forEach(function(item) {
        if(item.dataItem) {
          item.dataItem.category = newCategory;
        }
      });

      return items.length > 0;
    },

    getNewFileMenuOptions: function() {
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
                }
              },
              {
                text: 'RTF Document',
                options: {
                  extension: '.rtf',
                }
              },
              {
                text: 'Spreadsheet',
                options: {
                  extension: '.xls',
                }
              }
            ]
          }
        ],
        onItemClick: this.onItemClick
      };
    },

    getChangeCategoryMenuOptions: function() {
      return {
        items: [
          {
            text: 'Category',
            icon: 'tags',
            items: [
              {
                text: 'Work',
                options: {
                  category: 'Work'
                }
              },
              {
                text: 'Important',
                options: {
                  category: 'Important'
                }
              },
              {
                text: 'Home',
                options: {
                  category: 'Home'
                }
              },
              {
                text: 'None',
                options: {
                  category: ''
                }
              }
            ]
          }
        ],
        onItemClick: this.onItemClick
      };
    }
  }
};
</script>
