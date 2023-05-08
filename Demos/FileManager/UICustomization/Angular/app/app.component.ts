import {
  NgModule, Component, ViewChild, enableProdMode,
} from '@angular/core';
import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { DxFileManagerModule, DxFileManagerComponent } from 'devextreme-angular';
import FileManager from 'devextreme/ui/file_manager';

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

  newFileMenuOptions: any;

  changeCategoryMenuOptions: any;

  constructor(service: Service) {
    this.fileItems = service.getFileItems();
    this.newFileMenuOptions = {
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
      onItemClick: this.onItemClick.bind(this),
    };
    this.changeCategoryMenuOptions = {
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
      onItemClick: this.onItemClick.bind(this),
    };

    this.onItemClick = this.onItemClick.bind(this);
  }

  onItemClick({ itemData, viewArea, fileSystemItem }) {
    let updated = false;
    const extension = itemData.options ? itemData.options.extension : undefined;
    const category = itemData.options ? itemData.options.category : undefined;

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
