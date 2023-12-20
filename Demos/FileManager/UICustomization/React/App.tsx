import React, { useCallback, useRef } from 'react';
import FileManager, {
  Permissions, Toolbar, ContextMenu, Item, FileSelectionItem, ItemView, Details, Column,
} from 'devextreme-react/file-manager';
import { fileItems, getItemInfo } from './data.ts';

export default function App() {
  const fileManagerRef = useRef<FileManager>(null);

  const createFile = useCallback((
    fileExtension,
    directory = fileManagerRef.current.instance.getCurrentDirectory(),
  ) => {
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
  }, []);

  const updateCategory = useCallback((newCategory, directory, viewArea: string) => {
    let items = null;

    if (viewArea === 'navPane') {
      items = [directory];
    } else {
      items = fileManagerRef.current.instance.getSelectedItems();
    }

    items.forEach((item: { dataItem: { category: any; }; }) => {
      if (item.dataItem) {
        item.dataItem.category = newCategory;
      }
    });

    return items.length > 0;
  }, []);

  const onItemClick = useCallback(({ itemData, viewArea, fileSystemItem }) => {
    let updated = false;
    const { extension, category } = getItemInfo(itemData.text);

    if (extension) {
      updated = createFile(extension, fileSystemItem);
    } else if (category !== undefined) {
      updated = updateCategory(category, fileSystemItem, viewArea);
    }

    if (updated) {
      fileManagerRef.current.instance.refresh();
    }
  }, [createFile, updateCategory]);

  const getNewFileMenuOptions = useCallback(() => ({
    items: [
      {
        text: 'Create new file',
        icon: 'plus',
        items: [
          {
            text: 'Text Document',
            extension: '.txt',
          },
          {
            text: 'RTF Document',
            extension: '.rtf',
          },
          {
            text: 'Spreadsheet',
            extension: '.xls',
          },
        ],
      },
    ],
    onItemClick,
  }), [onItemClick]);

  const getChangeCategoryMenuOptions = useCallback(() => ({
    items: [
      {
        text: 'Category',
        icon: 'tags',
        items: [
          {
            text: 'Work',
            category: 'Work',
          },
          {
            text: 'Important',
            category: 'Important',
          },
          {
            text: 'Home',
            category: 'Home',
          },
          {
            text: 'None',
            category: '',
          },
        ],
      },
    ],
    onItemClick,
  }), [onItemClick]);

  return (
    <FileManager
      ref={fileManagerRef}
      fileSystemProvider={fileItems}
      onContextMenuItemClick={onItemClick}
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
        <Item name="showNavPane" visible={true} />
        <Item name="separator" />
        <Item name="create" />
        <Item widget="dxMenu" location="before" options={getNewFileMenuOptions()} />
        <Item name="refresh" />
        <Item name="separator" location="after" />
        <Item name="switchView" />

        <FileSelectionItem name="rename" />
        <FileSelectionItem name="separator" />
        <FileSelectionItem name="delete" />
        <FileSelectionItem name="separator" />
        <FileSelectionItem widget="dxMenu" location="before" options={getChangeCategoryMenuOptions()} />
        <FileSelectionItem name="refresh" />
        <FileSelectionItem name="clearSelection" />
      </Toolbar>
      <ContextMenu>
        <Item name="create" />
        <Item text="Create new file" icon="plus">
          <Item text="Text Document" />
          <Item text="RTF Document" />
          <Item text="Spreadsheet" />
        </Item>
        <Item name="rename" beginGroup />
        <Item name="delete" />
        <Item text="Category" icon="tags" beginGroup>
          <Item text="Work" />
          <Item text="Important" />
          <Item text="Home" />
          <Item text="None" />
        </Item>
        <Item name="refresh" />
      </ContextMenu>
    </FileManager>
  );
}
