import { NgModule, Component, ViewChild, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { DxFileManagerModule, DxFileManagerComponent } from 'devextreme-angular';
import FileManager from "devextreme/ui/file_manager";

import { Service, FileItem } from './app.service';

if (!/localhost/.test(document.location.host)) {
    enableProdMode();
}

@Component({
    selector: 'demo-app',
    templateUrl: 'app/app.component.html',
    providers: [Service],
    preserveWhitespaces: true
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
                    text: "Create new file",
                    icon: "plus",
                    items: [
                        {
                            text: "Text Document",
                            options: {
                                extension: ".txt",
                            }
                        },
                        {
                            text: "RTF Document",
                            options: {
                                extension: ".rtf",
                            }
                        },
                        {
                            text: "Spreadsheet",
                            options: {
                                extension: ".xls",
                            }
                        }
                    ]
                }
            ],
            onItemClick: this.onItemClick.bind(this)
        };
        this.changeCategoryMenuOptions = {
            items: [
                {
                    text: "Category",
                    icon: "tags",
                    items: [
                        {
                            text: "Work",
                            options: {
                                category: "Work"
                            }
                        },
                        {
                            text: "Important",
                            options: {
                                category: "Important"
                            }
                        },
                        {
                            text: "Home",
                            options: {
                                category: "Home"
                            }
                        },
                        {
                            text: "None",
                            options: {
                                category: ""
                            }
                        }
                    ]
                }
            ],
            onItemClick: this.onItemClick.bind(this)
        };

        this.onItemClick = this.onItemClick.bind(this);
    }

    onItemClick({itemData}) {
        let updated = false;
        const extension = itemData.options ? itemData.options.extension : undefined;
        const category = itemData.options ? itemData.options.category : undefined;

        if(extension) {
            updated = this.createFile(extension);
        } else if(category !== undefined) {
            updated = this.updateCategory(category);
        }

        if(updated) {
            this.fileManager.instance.refresh();
        }
    }

    createFile(fileExtension) {
        const currentDirectory = this.fileManager.instance.getCurrentDirectory();

        const newItem = {
            __KEY__: Date.now(),
            name: "New file" + fileExtension,
            isDirectory: false,
            size: 0
        };

        if(currentDirectory.dataItem) {
            currentDirectory.dataItem.items.push(newItem);
        } else {
            this.fileItems.push(newItem);
        }
        return true;
    }

    updateCategory(newCategory) {
        const selectedItems = this.fileManager.instance.getSelectedItems();

        selectedItems.forEach(function(selectedItem) {
            selectedItem.dataItem.category = newCategory;
        });

        return selectedItems.length > 0;
    }

}

@NgModule({
    imports: [
        BrowserModule,
        DxFileManagerModule
    ],
    declarations: [AppComponent],
    bootstrap: [AppComponent]
})

export class AppModule { }
platformBrowserDynamic().bootstrapModule(AppModule);
