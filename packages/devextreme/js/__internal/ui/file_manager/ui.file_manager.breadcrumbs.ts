import $ from '@js/core/renderer';
import type { ItemClickEvent, ItemRenderedEvent } from '@js/ui/menu';
import type { OptionChanged } from '@ts/core/widget/types';
import type { WidgetProperties } from '@ts/core/widget/widget';
import Widget from '@ts/core/widget/widget';
import Menu from '@ts/ui/menu/menu';

const FILE_MANAGER_BREADCRUMBS_CLASS = 'dx-filemanager-breadcrumbs';
const FILE_MANAGER_BREADCRUMBS_PARENT_FOLDER_ITEM_CLASS = `${FILE_MANAGER_BREADCRUMBS_CLASS}-parent-folder-item`;
const FILE_MANAGER_BREADCRUMBS_SEPARATOR_ITEM_CLASS = `${FILE_MANAGER_BREADCRUMBS_CLASS}-separator-item`;
const FILE_MANAGER_BREADCRUMBS_PATH_SEPARATOR_ITEM_CLASS = `${FILE_MANAGER_BREADCRUMBS_CLASS}-path-separator-item`;

interface FileManagerBreadcrumbsOptions extends WidgetProperties {
  rootFolderDisplayName?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onCurrentDirectoryChanging?: (e: { currentDirectory: any }) => void;
}

class FileManagerBreadcrumbs extends Widget<FileManagerBreadcrumbsOptions> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _currentDirectory?: any;

  _menu?: Menu;

  _actions!: { onCurrentDirectoryChanging?: ({ currentDirectory }) => void };

  _init(): void {
    super._init();
    this._currentDirectory = null;
  }

  _initMarkup(): void {
    super._initMarkup();

    this._initActions();

    if (this._currentDirectory) {
      this._renderMenu();
    }

    this.$element().addClass(FILE_MANAGER_BREADCRUMBS_CLASS);
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  setCurrentDirectory(directory): void {
    if (!this._areDirsEqual(this._currentDirectory, directory)) {
      this._currentDirectory = directory;
      this.repaint();
    }
  }

  _renderMenu(): void {
    const $menu = $('<div>').appendTo(this.$element());
    this._menu = this._createComponent($menu, Menu, {
      dataSource: this._getMenuItems(),
      // @ts-expect-error ts-error
      onItemClick: this._onItemClick.bind(this),
      // @ts-expect-error ts-error
      onItemRendered: this._onItemRendered.bind(this),
    });
  }

  // eslint-disable-next-line @stylistic/max-len
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type,@typescript-eslint/explicit-module-boundary-types
  _getMenuItems() {
    const dirLine = this._getParentDirsLine();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result: any = [
      {
        icon: 'arrowup',
        directory: this._currentDirectory.parentDirectory,
        isPathItem: true,
        cssClass: FILE_MANAGER_BREADCRUMBS_PARENT_FOLDER_ITEM_CLASS,
      },
      {
        text: ' ',
        cssClass: FILE_MANAGER_BREADCRUMBS_SEPARATOR_ITEM_CLASS,
      },
    ];

    dirLine.forEach((dir, index: number): void => {
      result.push({
        text: dir.getDisplayName(),
        directory: dir,
        isPathItem: true,
      });

      if (index !== dirLine.length - 1) {
        result.push({
          icon: 'spinnext',
          cssClass: FILE_MANAGER_BREADCRUMBS_PATH_SEPARATOR_ITEM_CLASS,
        });
      }
    });

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return result;
  }

  _onItemClick(e: ItemClickEvent): void {
    if (!e.itemData?.isPathItem) {
      return;
    }

    const newDir = e.itemData.directory;
    if (!this._areDirsEqual(newDir, this._currentDirectory)) {
      this._raiseCurrentDirectoryChanged(newDir);
    }
  }

  _onItemRendered(e: ItemRenderedEvent): void {
    if (e.itemData?.cssClass) {
      $(e.itemElement).addClass(e.itemData.cssClass);
    }
  }

  // eslint-disable-next-line @stylistic/max-len
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type,@typescript-eslint/explicit-module-boundary-types
  _getParentDirsLine() {
    let currentDirectory = this._currentDirectory;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result: any = [];

    while (currentDirectory) {
      result.unshift(currentDirectory);
      currentDirectory = currentDirectory.parentDirectory;
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return result;
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  _areDirsEqual(dir1, dir2): boolean {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return dir1 && dir2 && dir1 === dir2 && dir1.fileItem.key === dir2.fileItem.key;
  }

  _initActions(): void {
    this._actions = {
      onCurrentDirectoryChanging: this._createActionByOption(
        'onCurrentDirectoryChanging',
      ),
    };
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  _raiseCurrentDirectoryChanged(currentDirectory): void {
    this._actions.onCurrentDirectoryChanging?.({ currentDirectory });
  }

  _getDefaultOptions(): FileManagerBreadcrumbsOptions {
    return {
      ...super._getDefaultOptions(),
      rootFolderDisplayName: 'Files',
      onCurrentDirectoryChanging: undefined,
    };
  }

  _optionChanged(args: OptionChanged<FileManagerBreadcrumbsOptions>): void {
    const { name } = args;

    switch (name) {
      case 'rootFolderDisplayName':
        this.repaint();
        break;
      case 'onCurrentDirectoryChanging':
        this._actions[name] = this._createActionByOption(name);
        break;
      default:
        super._optionChanged(args);
    }
  }
}

export default FileManagerBreadcrumbs;
