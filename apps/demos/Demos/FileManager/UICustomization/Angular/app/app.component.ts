import { bootstrapApplication } from '@angular/platform-browser';
import {
  Component, enableProdMode, inject, viewChild,
} from '@angular/core';
import { DxFileManagerModule, DxFileManagerComponent } from 'devextreme-angular/ui/file-manager';
import type { DxFileManagerTypes } from 'devextreme-angular/ui/file-manager';
import { Service } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  templateUrl: './app.component.html',
  providers: [Service],
  preserveWhitespaces: true,
  imports: [
    DxFileManagerModule,
  ],
})

export class AppComponent {
  private readonly fileManager = viewChild.required(DxFileManagerComponent);

  private readonly service = inject(Service);

  readonly fileItems = this.service.getFileItems();

  readonly onItemClick = ({ itemData, viewArea, fileSystemItem }: DxFileManagerTypes.ContextMenuItemClickEvent): void => {
    let updated = false;
    const { extension, category } = this.service.getItemInfo(itemData.text);

    if (extension) {
      updated = this.createFile(extension, fileSystemItem);
    } else if (category !== undefined) {
      updated = this.updateCategory(category, fileSystemItem, viewArea);
    }

    if (updated) {
      this.fileManager().instance.refresh();
    }
  };

  readonly newFileMenuOptions = {
    items: [
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
    ],
    onItemClick: this.onItemClick,
  };

  readonly changeCategoryMenuOptions = {
    items: [
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
    ],
    onItemClick: this.onItemClick,
  };

  private createFile(
    fileExtension,
    directory = this.fileManager().instance.getCurrentDirectory()
  ) {
    const newItem = {
      __KEY__: Date.now(),
      name: `New file${fileExtension}`,
      isDirectory: false,
      size: 0,
    };

    if (!directory.isDirectory) {
      return false;
    }

    let array;
    if (!directory.dataItem) {
      array = this.fileItems;
    } else {
      array = directory.dataItem.items;
      if (!array) {
        directory.dataItem.items = [];
        array = [];
      }
    }

    array.push(newItem);
    return true;
  }

  private updateCategory(newCategory, directory, viewArea) {
    let items;
    if (viewArea === 'navPane') {
      items = [directory];
    } else {
      items = this.fileManager().instance.getSelectedItems();
    }

    items.forEach((item) => {
      if (item.dataItem) {
        item.dataItem.category = newCategory;
      }
    });

    return items.length > 0;
  }
}

bootstrapApplication(AppComponent);
