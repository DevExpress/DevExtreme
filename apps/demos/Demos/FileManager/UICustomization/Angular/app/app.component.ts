import {
  NgModule, Component, ViewChild, enableProdMode,
} from '@angular/core';
import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxFileManagerModule, DxFileManagerComponent, DxFileManagerTypes } from 'devextreme-angular/ui/file-manager';
import { Service, FileItem } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  templateUrl: 'app/app.component.html',
  providers: [Service],
  preserveWhitespaces: true,
})

export class AppComponent {
  @ViewChild(DxFileManagerComponent, { static: false }) fileManager: DxFileManagerComponent;

  fileItems: FileItem[];

  newFileMenuOptions = {
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
    onItemClick: this.onItemClick.bind(this),
  };

  changeCategoryMenuOptions = {
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
    onItemClick: this.onItemClick.bind(this),
  };

  private service: Service;

  constructor(service: Service) {
    this.service = service;
    this.fileItems = service.getFileItems();
    this.onItemClick = this.onItemClick.bind(this);
  }

  onItemClick({ itemData, viewArea, fileSystemItem }: DxFileManagerTypes.ContextMenuItemClickEvent): void {
    let updated = false;
    const { extension, category } = this.service.getItemInfo(itemData.text);

    if (extension) {
      updated = this.createFile(extension, fileSystemItem);
    } else if (category !== undefined) {
      updated = this.updateCategory(category, fileSystemItem, viewArea);
    }

    if (updated) {
      this.fileManager.instance.refresh();
    }
  }

  createFile(fileExtension, directory) {
    const newItem = {
      __KEY__: Date.now(),
      name: `New file${fileExtension}`,
      isDirectory: false,
      size: 0,
    };

    directory = directory || this.fileManager.instance.getCurrentDirectory();
    if (!directory.isDirectory) {
      return false;
    }

    let array = null;
    if (!directory.dataItem) {
      array = this.fileItems;
    } else {
      array = directory.dataItem.items;
      if (!array) {
        directory.dataItem.items = array = [];
      }
    }

    array.push(newItem);
    return true;
  }

  updateCategory(newCategory, directory, viewArea) {
    let items = null;

    if (viewArea === 'navPane') {
      items = [directory];
    } else {
      items = this.fileManager.instance.getSelectedItems();
    }

    items.forEach((item) => {
      if (item.dataItem) {
        item.dataItem.category = newCategory;
      }
    });

    return items.length > 0;
  }
}

@NgModule({
  imports: [
    BrowserModule,
    BrowserTransferStateModule,
    DxFileManagerModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})

export class AppModule { }
platformBrowserDynamic().bootstrapModule(AppModule);
