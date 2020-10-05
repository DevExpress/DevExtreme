import React from 'react';

import FileManager, { Permissions, Toolbar, ContextMenu, Item, FileSelectionItem, ItemView, Details, Column } from 'devextreme-react/file-manager';

import { fileItems } from './data.js';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.fileManagerRef = React.createRef();

    this.newFileMenuOptions = {
      items: [
        {
          text: 'Create new file',
          icon: 'plus',
          items: [
            {
              text: 'Text Document',
              extension: '.txt'
            },
            {
              text: 'RTF Document',
              extension: '.rtf'
            },
            {
              text: 'Spreadsheet',
              extension: '.xls'
            }
          ]
        }
      ],
      onItemClick: this.onItemClick.bind(this)
    };
    this.changeCategoryMenuOptions = {
      items: [
        {
          text: 'Category',
          icon: 'tags',
          items: [
            {
              text: 'Work',
              category: 'Work'
            },
            {
              text: 'Important',
              category: 'Important'
            },
            {
              text: 'Home',
              category: 'Home'
            },
            {
              text: 'None',
              category: ''
            }
          ]
        }
      ],
      onItemClick: this.onItemClick.bind(this)
    };

    this.onItemClick = this.onItemClick.bind(this);
    this.createFile = this.createFile.bind(this);
    this.updateCategory = this.updateCategory.bind(this);
  }
  render() {
    return (
      <FileManager
        ref={this.fileManagerRef}
        fileSystemProvider={fileItems}
        onContextMenuItemClick={this.onItemClick}
        height={450}>
        <Permissions
          create={true}
          delete={true}
          rename={true}
          download={true}>
        </Permissions>
        <ItemView showParentFolder={false}>
          <Details>
            <Column dataField="thumbnail"></Column>
            <Column dataField="name"></Column>
            <Column dataField="category" caption="Category" width="95"></Column>
            <Column dataField="dateModified"></Column>
            <Column dataField="size"></Column>
          </Details>
        </ItemView>
        <Toolbar>
          <Item name="showNavPane" visible="true" />
          <Item name="separator" />
          <Item name="create" />
          <Item widget="dxMenu" location="before" options={this.newFileMenuOptions} />
          <Item name="refresh" />
          <Item name="separator" location="after" />
          <Item name="switchView" />

          <FileSelectionItem name="rename" />
          <FileSelectionItem name="separator" />
          <FileSelectionItem name="delete" />
          <FileSelectionItem name="separator" />
          <FileSelectionItem widget="dxMenu" location="before" options={this.changeCategoryMenuOptions} />
          <FileSelectionItem name="refresh" />
          <FileSelectionItem name="clearSelection" />
        </Toolbar>
        <ContextMenu>
          <Item name="create" />
          <Item text="Create new file" icon="plus">
            <Item text="Text Document" extension=".txt" />
            <Item text="RTF Document" extension=".rtf" />
            <Item text="Spreadsheet" extension=".xls" />
          </Item>
          <Item name="rename" beginGroup="true" />
          <Item name="delete" />
          <Item text="Category" icon="tags" beginGroup="true">
            <Item text="Work" category="Work" />
            <Item text="Important" category="Important" />
            <Item text="Home" category="Home" />
            <Item text="None" category="" />
          </Item>
          <Item name="refresh" />
        </ContextMenu>
      </FileManager>
    );
  }

  get fileManager() {
    return this.fileManagerRef.current.instance;
  }

  onItemClick({ itemData, viewArea, fileSystemItem }) {
    let updated = false;

    if(itemData.extension) {
      updated = this.createFile(itemData.extension, fileSystemItem);
    } else if(itemData.category !== undefined) {
      updated = this.updateCategory(itemData.category, fileSystemItem, viewArea);
    }

    if(updated) {
      this.fileManager.refresh();
    }
  }

  createFile(fileExtension, directory) {
    var newItem = {
      __KEY__: Date.now(),
      name: `New file${ fileExtension}`,
      isDirectory: false,
      size: 0
    };

    directory = directory || this.fileManager.getCurrentDirectory();
    if(!directory.isDirectory) {
      return false;
    }

    var array = null;
    if(!directory.dataItem) {
      array = fileItems;
    }
    else {
      array = directory.dataItem.items;
      if(!array) {
        directory.dataItem.items = array = [];
      }
    }

    array.push(newItem);
    return true;
  }

  updateCategory(newCategory, directory, viewArea) {
    var items = null;

    if(viewArea === 'navPane') {
      items = [ directory ];
    } else {
      items = this.fileManager.getSelectedItems();
    }

    items.forEach(function(item) {
      if(item.dataItem) {
        item.dataItem.category = newCategory;
      }
    });

    return items.length > 0;
  }
}

export default App;
