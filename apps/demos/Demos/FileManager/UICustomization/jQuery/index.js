$(() => {
  const fileManager = $('#file-manager').dxFileManager({
    name: 'fileManager',
    fileSystemProvider: fileSystem,
    height: 450,
    permissions: {
      create: true,
      delete: true,
      rename: true,
      download: true,
    },
    itemView: {
      details: {
        columns: [
          'thumbnail', 'name',
          {
            dataField: 'category',
            caption: 'Category',
            width: 95,
          },
          'dateModified', 'size',
        ],
      },
      showParentFolder: false,
    },
    toolbar: {
      items: [
        {
          name: 'showNavPane',
          visible: true,
        },
        'separator', 'create',
        {
          widget: 'dxMenu',
          location: 'before',
          options: {
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
          },
        },
        'refresh',
        {
          name: 'separator',
          location: 'after',
        },
        'switchView',
      ],
      fileSelectionItems: [
        'rename', 'separator', 'delete', 'separator',
        {
          widget: 'dxMenu',
          options: {
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
          },
          location: 'before',
        },
        'refresh', 'clearSelection',
      ],
    },
    onContextMenuItemClick: onItemClick,
    contextMenu: {
      items: [
        'create',
        {
          text: 'Create new file',
          icon: 'plus',
          items: [
            {
              text: 'Text Document',
            },
            {
              text: 'RTF Document',
            },
            {
              text: 'Spreadsheet',
            },
          ],
        },
        {
          name: 'rename',
          beginGroup: true,
        },
        'delete',
        {
          text: 'Category',
          icon: 'tags',
          beginGroup: true,
          items: [
            {
              text: 'Work',
            },
            {
              text: 'Important',
            },
            {
              text: 'Home',
            },
            {
              text: 'None',
            },
          ],
        },
        'refresh',
      ],
    },
  }).dxFileManager('instance');

  function onItemClick(args) {
    let updated = false;
    const { extension, category } = getItemInfo(args.itemData.text);

    if (extension) {
      updated = createFile(extension, args.fileSystemItem);
    } else if (category !== undefined) {
      updated = updateCategory(category, args.fileSystemItem, args.viewArea);
    }

    if (updated) {
      fileManager.refresh();
    }
  }

  function createFile(fileExtension, directory = fileManager.getCurrentDirectory()) {
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
      array = fileSystem;
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
      items = fileManager.getSelectedItems();
    }

    items.forEach((item) => {
      if (item.dataItem) {
        item.dataItem.category = newCategory;
      }
    });

    return items.length > 0;
  }
});
