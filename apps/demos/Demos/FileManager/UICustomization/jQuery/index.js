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
        {
          name: 'rename',
          beginGroup: true,
        },
        'delete',
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
          beginGroup: true,
        },
        'refresh',
      ],
    },
  }).dxFileManager('instance');

  function onItemClick(args) {
    let updated = false;

    if (args.itemData.extension) {
      updated = createFile(args.itemData.extension, args.fileSystemItem);
    } else if (args.itemData.category !== undefined) {
      updated = updateCategory(args.itemData.category, args.fileSystemItem, args.viewArea);
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
