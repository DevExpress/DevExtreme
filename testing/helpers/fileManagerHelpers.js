import $ from "jquery";
import { deserializeDate } from "core/utils/date_serialization";
import { FileManagerItem } from "ui/file_manager/file_provider/file_provider";

export const Consts = {
    WIDGET_CLASS: "dx-filemanager",
    TOOLBAR_CLASS: "dx-filemanager-toolbar",
    GENERAL_TOOLBAR_CLASS: "dx-filemanager-general-toolbar",
    FILE_TOOLBAR_CLASS: "dx-filemanager-file-toolbar",
    CONTAINER_CLASS: "dx-filemanager-container",
    DRAWER_PANEL_CONTENT_CLASS: "dx-drawer-panel-content",
    DRAWER_CONTENT_CLASS: "dx-drawer-content",
    DIRS_PANEL_CLASS: "dx-filemanager-dirs-panel",
    DIRS_TREE_CLASS: "dx-filemanager-dirs-tree",
    ITEMS_VIEW_CLASS: "dx-filemanager-files-view",
    DIALOG_CLASS: "dx-filemanager-dialog",
    THUMBNAILS_ITEM_CLASS: "dx-filemanager-thumbnails-item",
    THUMBNAILS_ITEM_NAME_CLASS: "dx-filemanager-thumbnails-item-name",
    GRID_DATA_ROW_CLASS: "dx-data-row",
    FILE_ACTION_BUTTON_CLASS: "dx-filemanager-file-actions-button",
    FOLDERS_TREE_VIEW_ITEM_CLASS: "dx-treeview-item",
    FOLDERS_TREE_VIEW_ITEM_TOGGLE_CLASS: "dx-treeview-toggle-item-visibility",
    BREADCRUMBS_CLASS: "dx-filemanager-breadcrumbs",
    BREADCRUMBS_PARENT_DIRECOTRY_ITEM_CLASS: "dx-filemanager-breadcrumbs-parent-folder-item",
    BREADCRUMBS_SEPARATOR_ITEM_CLASS: "dx-filemanager-breadcrumbs-separator-item",
    ITEMS_GRID_VIEW_CLASS: "dx-filemanager-files-view",
    FOCUSED_ITEM_CLASS: "dx-filemanager-focused-item",
    INACTIVE_AREA_CLASS: "dx-filemanager-inactive-area",
    CUSTOM_THUMBNAIL_CLASS: "dx-filemanager-item-custom-thumbnail",
    TOOLBAR_SEPARATOR_ITEM: "dx-filemanager-toolbar-separator-item",
    DETAILS_ITEM_NAME_CLASS: "dx-filemanager-details-item-name",
    POPUP_NORMAL_CLASS: "dx-popup-normal",
    POPUP_BOTTOM_CLASS: "dx-popup-bottom",
    BUTTON_CLASS: "dx-button",
    BUTTON_TEXT_CLASS: "dx-button-text",
    SELECT_BOX_CLASS: "dx-selectbox",
    TEXT_EDITOR_INPUT_CLASS: "dx-texteditor-input",
    MENU_ITEM_WITH_TEXT_CLASS: "dx-menu-item-has-text",
    CONTEXT_MENU_CLASS: "dx-context-menu",
    MENU_ITEM_CLASS: "dx-menu-item",
    MENU_ITEM_WITH_SUBMENU_CLASS: "dx-menu-item-has-submenu",
    SUBMENU_CLASS: "dx-submenu",
    SELECTION_CLASS: "dx-selection",
    SPLITTER_CLASS: "dx-splitter",
    DISABLED_STATE_CLASS: "dx-state-disabled",
    UPLOAD_ICON_CLASS: "dx-icon-upload",
    DROPDOWN_MENU_BUTTON_CLASS: "dx-dropdownmenu-button",
    DROPDOWN_MENU_LIST_CLASS: "dx-dropdownmenu-list",
    DROPDOWN_MENU_CONTENT_CLASS: "dx-scrollview-content",
    DROPDOWN_MENU_LIST_ITEM_CLASS: "dx-list-item",
    SCROLLABLE_ClASS: "dx-scrollable"
};
const showMoreButtonText = "\u22EE";

export class FileManagerWrapper {

    constructor($element) {
        this._$element = $element;
    }

    getInstance() {
        return this._$element.dxFileManager("instance");
    }

    getDirsPanel() {
        return this._$element.find(`.${Consts.DIRS_PANEL_CLASS}`);
    }

    getDirsTree() {
        return this.getDirsPanel().find(` .${Consts.DIRS_TREE_CLASS}`);
    }

    getItemsView() {
        return this._$element.find(`.${Consts.ITEMS_VIEW_CLASS}`);
    }

    getFolderNodes(inDialog) {
        if(inDialog) {
            return $(`.${Consts.DIALOG_CLASS} .${Consts.FOLDERS_TREE_VIEW_ITEM_CLASS}`);
        }
        return this._$element.find(`.${Consts.CONTAINER_CLASS} .${Consts.FOLDERS_TREE_VIEW_ITEM_CLASS}`);
    }

    getFolderNode(index, inDialog) {
        return this.getFolderNodes(inDialog).eq(index);
    }

    getFolderNodeText(index, inDialog) {
        const text = this.getFolderNode(index, inDialog).text() || "";
        return text.replace(showMoreButtonText, "");
    }

    getFolderToggles(inDialog) {
        if(inDialog) {
            return $(`.${Consts.DIALOG_CLASS} .${Consts.FOLDERS_TREE_VIEW_ITEM_TOGGLE_CLASS}`);
        }
        return this._$element.find(`.${Consts.CONTAINER_CLASS} .${Consts.FOLDERS_TREE_VIEW_ITEM_TOGGLE_CLASS}`);
    }

    getFolderToggle(index, inDialog) {
        return this.getFolderToggles(inDialog).eq(index);
    }

    getFocusedItemText() {
        return this._$element.find(`.${Consts.CONTAINER_CLASS} .${Consts.FOCUSED_ITEM_CLASS} span`).text();
    }

    getFolderActionButton(index) {
        const $folderNode = this.getFolderNode(index);
        return this._findActionButton($folderNode);
    }

    getBreadcrumbsWrapper() {
        return new FileManagerBreadcrumbsWrapper(this._$element.find(`.${Consts.BREADCRUMBS_CLASS}`));
    }

    getBreadcrumbsPath() {
        return this.getBreadcrumbsWrapper().getPath();
    }

    getBreadcrumbsItems() {
        return this.getBreadcrumbsWrapper().getItems();
    }

    getBreadcrumbsItemByText(text) {
        return this.getBreadcrumbsWrapper().getItemByText(text);
    }

    getBreadcrumbsParentDirectoryItem() {
        return this.getBreadcrumbsWrapper().getParentDirectoryItem();
    }

    getToolbar() {
        return this._$element.find(`.${Consts.TOOLBAR_CLASS}`);
    }

    getToolbarElements() {
        return this._$element.find(`.${Consts.TOOLBAR_CLASS} .${Consts.BUTTON_TEXT_CLASS}:visible, .${Consts.TOOLBAR_CLASS} .${Consts.SELECT_BOX_CLASS}:visible input[type='hidden']`);
    }

    getGeneralToolbarElements() {
        const _$generalToolbar = this.getToolbar().children().first();
        return _$generalToolbar.find(`.${Consts.BUTTON_CLASS}, .${Consts.SELECT_BOX_CLASS}:visible input[type='hidden']`);
    }

    getToolbarButton(text) {
        return this._$element.find(`.${Consts.TOOLBAR_CLASS} .${Consts.BUTTON_CLASS}:contains('${text}')`);
    }

    getToolbarSeparators() {
        return this._$element.find(`.${Consts.TOOLBAR_CLASS} .${Consts.TOOLBAR_SEPARATOR_ITEM}:visible`);
    }

    getToolbarDropDownMenuButton() {
        return this._$element.find(`.${Consts.DROPDOWN_MENU_BUTTON_CLASS}`);
    }

    getToolbarDropDownMenuItem(childIndex) {
        return $(`.${Consts.DROPDOWN_MENU_LIST_CLASS} .${Consts.DROPDOWN_MENU_CONTENT_CLASS} .${Consts.DROPDOWN_MENU_LIST_ITEM_CLASS}`)[childIndex];
    }

    getToolbarViewSwitcherListItem(childIndex) {
        return $(`.${Consts.POPUP_NORMAL_CLASS} .${Consts.DROPDOWN_MENU_CONTENT_CLASS} .${Consts.DROPDOWN_MENU_LIST_ITEM_CLASS}`)[childIndex];
    }

    getCustomThumbnails() {
        return this._$element.find(`.${Consts.CUSTOM_THUMBNAIL_CLASS}`);
    }

    getDetailsItemList() {
        return this._$element.find(`.${Consts.ITEMS_GRID_VIEW_CLASS}`);
    }

    getThumbnailsItems() {
        return this._$element.find(`.${Consts.THUMBNAILS_ITEM_CLASS}`);
    }

    getThumbnailsItemName(index) {
        return this.getThumbnailsItems().eq(index).find(`.${Consts.THUMBNAILS_ITEM_NAME_CLASS}`).text();
    }

    findThumbnailsItem(itemName) {
        return this.getThumbnailsItems().filter(`:contains('${itemName}')`);
    }

    findDetailsItem(itemName) {
        return this._$element.find(`.${Consts.GRID_DATA_ROW_CLASS} > td:contains('${itemName}')`);
    }

    getDetailsItemScrollable() {
        return this.getDetailsItemList().find(`.${Consts.SCROLLABLE_ClASS}`);
    }

    getDetailsItemName(index) {
        return this._$element.find(`.${Consts.DETAILS_ITEM_NAME_CLASS}`).eq(index).text();
    }

    getRowActionButtonInDetailsView(index) {
        const $row = this.getRowInDetailsView(index);
        return this._findActionButton($row);
    }

    getSelectCheckBoxInDetailsView(index) {
        return this.getRowInDetailsView(index).find("td").eq(0);
    }

    getRowNameCellInDetailsView(index) {
        return this.getRowInDetailsView(index).find("td").eq(1);
    }

    getRowsInDetailsView() {
        return this._$element.find(`.${Consts.GRID_DATA_ROW_CLASS}`);
    }

    getRowInDetailsView(index) {
        return this._$element.find(`.${Consts.GRID_DATA_ROW_CLASS}[aria-rowindex=${index}]`);
    }

    getColumnCellsInDetailsView(index) {
        return this._$element.find(`.${Consts.GRID_DATA_ROW_CLASS} > td:nth-child(${index})`);
    }

    getColumnHeaderInDetailsView(index) {
        return this._$element.find("[id*=dx-col]").eq(index);
    }

    getContextMenuItems(visible) {
        let selector = `.${Consts.CONTEXT_MENU_CLASS} .${Consts.MENU_ITEM_CLASS}`;
        if(visible) {
            selector += ":visible";
        }
        return $(selector);
    }

    getContextMenuItem(text) {
        return this.getContextMenuItems(true).filter(`:contains('${text}')`);
    }

    getContextMenuSubMenuItems() {
        return $(`.${Consts.CONTEXT_MENU_CLASS} .${Consts.MENU_ITEM_WITH_SUBMENU_CLASS} .${Consts.SUBMENU_CLASS} .${Consts.MENU_ITEM_CLASS}`);
    }

    _findActionButton($container) {
        return $container.find(`.${Consts.FILE_ACTION_BUTTON_CLASS} .${Consts.BUTTON_CLASS}`);
    }

    getDrawerPanelContent() {
        return this._$element.find(`.${Consts.CONTAINER_CLASS} .${Consts.DRAWER_PANEL_CONTENT_CLASS}`);
    }

    getItemsPanel() {
        return this._$element.find(`.${Consts.CONTAINER_CLASS} .${Consts.DRAWER_CONTENT_CLASS}`);
    }

    moveSplitter(delta, pointerType) {
        const $splitter = this.getSplitter();
        const $drawerContent = this.getDrawerPanelContent();
        if(!pointerType) {
            pointerType = "mouse";
        }

        $splitter.trigger($.Event("dxpointerdown", { pointerType }));
        const contentRect = $drawerContent[0].getBoundingClientRect();
        $splitter.trigger($.Event("dxpointermove", {
            pointerType,
            pageX: contentRect.right - parseFloat($splitter.css('margin-left')) + delta
        }));

        $splitter.trigger($.Event("dxpointerup", { pointerType }));
    }

    isSplitterActive() {
        return !this.getSplitter().hasClass(Consts.DISABLED_STATE_CLASS);
    }

    getSplitter() {
        return this._$element.find(`.${Consts.SPLITTER_CLASS}`);
    }

    getDialogTextInput() {
        return $(`.${Consts.DIALOG_CLASS} .${Consts.TEXT_EDITOR_INPUT_CLASS}`);
    }

    getDialogButton(text) {
        return $(`.${Consts.POPUP_BOTTOM_CLASS} .${Consts.BUTTON_CLASS}:contains('${text}')`);
    }

}

export class FileManagerProgressPanelWrapper {

    constructor($element) {
        this._$element = $element;
    }

    getInfos() {
        return this._$element
            .find(".dx-filemanager-progress-panel-infos-container > .dx-filemanager-progress-panel-info")
            .map((_, info) => new FileManagerProgressPanelInfoWrapper($(info)))
            .get();
    }

    getSeparators() {
        return this._$element.find(".dx-filemanager-progress-panel-infos-container > .dx-filemanager-progress-panel-separator");
    }

    findProgressBoxes($container) {
        return $container
            .children(".dx-filemanager-progress-box")
            .map((_, element) => new FileManagerProgressPanelProgressBoxWrapper($(element)))
            .get();
    }

    findError($container) {
        return $container.find(".dx-filemanager-progress-box-error");
    }

    get $closeButton() {
        return this._$element.find(".dx-filemanager-progress-panel-close-button");
    }

}

export class FileManagerProgressPanelInfoWrapper {

    constructor($element) {
        this._$element = $element;
    }

    get common() {
        const $common = this._$element.find(".dx-filemanager-progress-panel-common");
        return new FileManagerProgressPanelProgressBoxWrapper($common);
    }

    get details() {
        return this._$element
            .find(".dx-filemanager-progress-panel-details > .dx-filemanager-progress-box")
            .map((_, detailsInfo) => new FileManagerProgressPanelProgressBoxWrapper($(detailsInfo)))
            .get();
    }

}

export class FileManagerProgressPanelProgressBoxWrapper {

    constructor($element) {
        this._$element = $element;
    }

    get $element() {
        return this._$element;
    }

    get $commonText() {
        return this._$element.find(".dx-filemanager-progress-box-common");
    }

    get commonText() {
        return this.$commonText.text();
    }

    get $progressBar() {
        return this._$element.find(".dx-filemanager-progress-box-progress-bar");
    }

    get progressBar() {
        return this.$progressBar.dxProgressBar("instance");
    }

    get progressBarStatusText() {
        return this.$progressBar.find(".dx-progressbar-status").text();
    }

    get progressBarValue() {
        return this.progressBar.option("value");
    }

    get $closeButton() {
        return this._$element.find(".dx-filemanager-progress-box-close-button");
    }

    get closeButton() {
        return this.$closeButton.dxButton("instance");
    }

    get closeButtonVisible() {
        return this.closeButton.option("visible");
    }

    get $image() {
        return this._$element.find(".dx-filemanager-progress-box-image");
    }

    get $error() {
        return this._$element.find(".dx-filemanager-progress-box-error");
    }

    get errorText() {
        return this.$error.text();
    }

    get hasError() {
        return this.$error.length !== 0;
    }

}

export class FileManagerBreadcrumbsWrapper {

    constructor($element) {
        this._$element = $element;
    }

    getItems() {
        return this._$element.find(`.${Consts.MENU_ITEM_WITH_TEXT_CLASS}:not(.${Consts.BREADCRUMBS_SEPARATOR_ITEM_CLASS})`);
    }

    getItemByText(text) {
        return this.getItems().filter(function() {
            const content = $(this).text();
            return content === text;
        }).first();
    }

    getPath() {
        let result = "";
        const $elements = this.getItems();
        $elements.each((_, element) => {
            const name = $(element).text();
            result = result ? `${result}/${name}` : name;
        });
        return result;
    }

    getParentDirectoryItem() {
        return this._$element.find(`.${Consts.BREADCRUMBS_PARENT_DIRECOTRY_ITEM_CLASS}`);
    }

}

export const stringify = obj => {
    if(Array.isArray(obj)) {
        const content = obj
            .map(item => stringify(item))
            .join(",\n");
        return `[ ${content} ]`;
    }

    if(typeof obj !== "object") {
        return JSON.stringify(obj);
    }

    let props = Object
        .keys(obj)
        .map(key => `${key}: ${stringify(obj[key])}`)
        .join(", ");
    return `{ ${props} }`;
};

export const createTestFileSystem = () => {
    return [
        {
            name: "Folder 1",
            isDirectory: true,
            items: [
                {
                    name: "Folder 1.1",
                    isDirectory: true,
                    items: [
                        {
                            name: "Folder 1.1.1",
                            isDirectory: true,
                            items: [
                                {
                                    name: "Folder 1.1.1.1",
                                    isDirectory: true,
                                    items: [
                                        {
                                            name: "Folder 1.1.1.1.1",
                                            isDirectory: true,
                                            items: [
                                                {
                                                    name: "Special deep file.txt",
                                                    isDirectory: false,
                                                    size: 600
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            name: "File 1-1.txt",
                            isDirectory: false
                        },
                        {
                            name: "File 1-2.txt",
                            isDirectory: false
                        },
                        {
                            name: "File 1-3.png",
                            isDirectory: false
                        },
                        {
                            name: "File 1-4.jpg",
                            isDirectory: false
                        }]
                },
                {
                    name: "Folder 1.2",
                    isDirectory: true
                },
                {
                    name: "File 1-1.txt",
                    isDirectory: false
                },
                {
                    name: "File 1-2.jpg",
                    isDirectory: false
                }]
        },
        {
            name: "Folder 2",
            isDirectory: true,
            items: [
                {
                    name: "File 2-1.jpg",
                    isDirectory: false
                }]
        },
        {
            name: "Folder 3",
            isDirectory: true
        },
        {
            name: "File 1.txt",
            isDirectory: false
        },
        {
            name: "File 2.jpg",
            isDirectory: false
        },
        {
            name: "File 3.xml",
            isDirectory: false
        }
    ];
};

export const createUploaderFiles = count => {
    const result = [];

    for(let i = 0; i < count; i++) {
        const size = 300000 + i * 200000;
        const file = {
            name: `Upload file ${i}.txt`,
            size,
            slice: (startPos, endPos) => ({
                fileIndex: i,
                startPos,
                endPos,
                size: Math.min(endPos, size) - startPos
            })
        };
        result.push(file);
    }

    return result;
};

export const createSampleFileItems = () => {
    const filesPathInfo = [
        { key: "Root", name: "Root" },
        { key: "Root/Files", name: "Files" },
    ];

    const itemData = [
        { id: "Root\\Files\\Documents", name: "Documents", dateModified: "2019-02-14T07:44:15.4265625Z", isDirectory: true, size: 0, pathInfo: filesPathInfo },
        { id: "Root\\Files\\Images", name: "Images", dateModified: "2019-02-14T07:44:15.4885105Z", isDirectory: true, size: 0, pathInfo: filesPathInfo },
        { id: "Root\\Files\\Music", name: "Music", dateModified: "2019-02-14T07:44:15.4964648Z", isDirectory: true, size: 0, pathInfo: filesPathInfo },
        { id: "Root\\Files\\Description.rtf", name: "Description.rtf", dateModified: "2017-02-09T09:38:46.3772529Z", isDirectory: false, size: 1, pathInfo: filesPathInfo },
        { id: "Root\\Files\\Article.txt", name: "Article.txt", dateModified: "2017-02-09T09:38:46.3772529Z", isDirectory: false, size: 1, pathInfo: filesPathInfo }
    ];

    const fileManagerItems = [
        createFileManagerItem(filesPathInfo, itemData[0]),
        createFileManagerItem(filesPathInfo, itemData[1]),
        createFileManagerItem(filesPathInfo, itemData[2]),
        createFileManagerItem(filesPathInfo, itemData[3]),
        createFileManagerItem(filesPathInfo, itemData[4])
    ];

    return { filesPathInfo, itemData, fileManagerItems };
};

const createFileManagerItem = (parentPath, dataObj) => {
    let item = new FileManagerItem(parentPath, dataObj.name, dataObj.isDirectory);
    item.dateModified = deserializeDate(dataObj.dateModified);
    item.size = dataObj.size;
    item.dataItem = dataObj;
    if(dataObj.isDirectory) {
        item.hasSubDirs = true;
    }
    return item;
};


