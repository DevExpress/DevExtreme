import $ from 'jquery';
import devices from 'core/devices';
import { deserializeDate } from 'core/utils/date_serialization';
import FileSystemItem from 'file_management/file_system_item';

import FileReaderMock from './fileManager/file_reader.mock.js';

export const Consts = {
    WIDGET_CLASS: 'dx-filemanager',
    WIDGET_WRAPPER_CLASS: 'dx-filemanager-wrapper',
    TOOLBAR_CLASS: 'dx-filemanager-toolbar',
    NATIVE_TOOLBAR_CLASS: 'dx-toolbar',
    GENERAL_TOOLBAR_CLASS: 'dx-filemanager-general-toolbar',
    FILE_TOOLBAR_CLASS: 'dx-filemanager-file-toolbar',
    CONTAINER_CLASS: 'dx-filemanager-container',
    DRAWER_PANEL_CONTENT_CLASS: 'dx-drawer-panel-content',
    DRAWER_CONTENT_CLASS: 'dx-drawer-content',
    DRAWER_MODE_SHRINK: 'dx-drawer-shrink',
    DRAWER_MODE_OVERLAP: 'dx-drawer-overlap',
    NOTIFICATION_DRAWER_CLASS: 'dx-filemanager-notification-drawer',
    NOTIFICATION_DRAWER_PANEL_CLASS: 'dx-filemanager-notification-drawer-panel',
    ADAPTIVITY_DRAWER_PANEL_CLASS: 'dx-filemanager-adaptivity-drawer-panel',
    PROGRESS_PANEL_CLASS: 'dx-filemanager-progress-panel',
    PROGRESS_PANEL_TITLE_CLASS: 'dx-filemanager-progress-panel-title',
    PROGRESS_PANEL_CONTAINER_CLASS: 'dx-filemanager-progress-panel-container',
    PROGRESS_PANEL_INFOS_CONTAINER_CLASS: 'dx-filemanager-progress-panel-infos-container',
    DIRS_PANEL_CLASS: 'dx-filemanager-dirs-panel',
    DIRS_TREE_CLASS: 'dx-filemanager-dirs-tree',
    ITEMS_VIEW_CLASS: 'dx-filemanager-files-view',
    DIALOG_CLASS: 'dx-filemanager-dialog',
    THUMBNAILS_VIEW_CLASS: 'dx-filemanager-thumbnails',
    THUMBNAILS_VIEW_PORT_CLASS: 'dx-filemanager-thumbnails-view-port',
    THUMBNAILS_ITEM_CLASS: 'dx-filemanager-thumbnails-item',
    THUMBNAILS_ITEM_NAME_CLASS: 'dx-filemanager-thumbnails-item-name',
    THUMBNAILS_ITEM_SPACER_CLASS: 'dx-filemanager-thumbnails-item-spacer',
    THUMBNAILS_ITEM_THUMBNAIL_CLASS: 'dx-filemanager-thumbnails-item-thumbnail',
    THUMBNAILS_ITEM_CONTENT_CLASS: 'dx-filemanager-thumbnails-item-content',
    GRID_DATA_ROW_CLASS: 'dx-data-row',
    FILE_ACTION_BUTTON_CLASS: 'dx-filemanager-file-actions-button',
    FOLDERS_TREE_VIEW_ITEM_CLASS: 'dx-treeview-item',
    FOLDERS_TREE_VIEW_ITEM_TOGGLE_CLASS: 'dx-treeview-toggle-item-visibility',
    BREADCRUMBS_CLASS: 'dx-filemanager-breadcrumbs',
    BREADCRUMBS_PARENT_DIRECOTRY_ITEM_CLASS: 'dx-filemanager-breadcrumbs-parent-folder-item',
    BREADCRUMBS_SEPARATOR_ITEM_CLASS: 'dx-filemanager-breadcrumbs-separator-item',
    ITEMS_PANEL_CLASS: 'dx-filemanager-items-panel',
    ITEMS_GRID_VIEW_CLASS: 'dx-filemanager-files-view',
    FOCUSED_ITEM_CLASS: 'dx-filemanager-focused-item',
    INACTIVE_AREA_CLASS: 'dx-filemanager-inactive-area',
    CUSTOM_THUMBNAIL_CLASS: 'dx-filemanager-item-custom-thumbnail',
    TOOLBAR_SEPARATOR_ITEM: 'dx-filemanager-toolbar-separator-item',
    DETAILS_VIEW_CLASS: 'dx-filemanager-details',
    DETAILS_ITEM_NAME_CLASS: 'dx-filemanager-details-item-name',
    FOLDER_CHOOSER_DIALOG_CLASS: 'dx-filemanager-dialog-folder-chooser-popup',
    POPUP_NORMAL_CLASS: 'dx-popup-normal',
    POPUP_BOTTOM_CLASS: 'dx-popup-bottom',
    BUTTON_CLASS: 'dx-button',
    BUTTON_HAS_TEXT_CLASS: 'dx-button-has-text',
    BUTTON_TEXT_CLASS: 'dx-button-text',
    DROP_DOWN_BUTTON_CLASS: 'dx-dropdownbutton',
    DROP_DOWN_BUTTON_ACTION_CLASS: 'dx-dropdownbutton-action',
    TEXT_EDITOR_INPUT_CLASS: 'dx-texteditor-input',
    MENU_ITEM_WITH_TEXT_CLASS: 'dx-menu-item-has-text',
    CONTEXT_MENU_CLASS: 'dx-context-menu',
    MENU_ITEM_CLASS: 'dx-menu-item',
    MENU_ITEM_WITH_SUBMENU_CLASS: 'dx-menu-item-has-submenu',
    SUBMENU_CLASS: 'dx-submenu',
    SELECTION_CLASS: 'dx-selection',
    ITEM_SELECTED_CLASS: 'dx-item-selected',
    FOCUSED_ROW_CLASS: 'dx-row-focused',
    SPLITTER_WRAPPER_CLASS: 'dx-splitter-wrapper',
    SPLITTER_CLASS: 'dx-splitter',
    FOCUSED_STATE_CLASS: 'dx-state-focused',
    DISABLED_STATE_CLASS: 'dx-state-disabled',
    UPLOAD_ICON_CLASS: 'dx-icon-upload',
    DROPDOWN_MENU_BUTTON_CLASS: 'dx-dropdownmenu-button',
    DROPDOWN_MENU_LIST_CLASS: 'dx-dropdownmenu-list',
    DROPDOWN_MENU_CONTENT_CLASS: 'dx-scrollview-content',
    DROPDOWN_MENU_LIST_ITEM_CLASS: 'dx-list-item',
    SCROLLABLE_ClASS: 'dx-scrollable',
    SCROLLABLE_CONTAINER_ClASS: 'dx-scrollable-container',
    EDITING_CONTAINER: 'dx-filemanager-editing-container',
    FILE_UPLOADER_INPUT: 'dx-fileuploader-input',
    FILE_UPLOADER_DROPZONE_PLACEHOLER_CLASS: 'dx-filemanager-fileuploader-dropzone-placeholder'
};
const showMoreButtonText = '\u22EE';

export class FileManagerWrapper {

    constructor($element) {
        this._$element = $element;
    }

    getInstance() {
        return this._$element.dxFileManager('instance');
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

    getItemsViewPanel() {
        return this._$element.find(`.${Consts.ITEMS_PANEL_CLASS}`);
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
        const text = this.getFolderNode(index, inDialog).text() || '';
        return text.replace(showMoreButtonText, '');
    }

    getFolderNodeByText(text, inDialog) {
        return this.getFolderNodes(inDialog).filter(function(index, node) {
            const content = $(node).text();
            return content === text;
        }).first();
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
        return this._$element.find(`.${Consts.TOOLBAR_CLASS} .${Consts.BUTTON_TEXT_CLASS}:visible, .${Consts.TOOLBAR_CLASS} .${Consts.NATIVE_TOOLBAR_CLASS}:visible .${Consts.DROP_DOWN_BUTTON_CLASS}`);
    }

    getToolbarElementsInSection(sectionName) {
        const visibleToolbarSection = this.getToolbar().find(`.${Consts.NATIVE_TOOLBAR_CLASS}:visible .${Consts.NATIVE_TOOLBAR_CLASS}-${sectionName}`);
        return visibleToolbarSection.find(`.${Consts.BUTTON_CLASS}:not(.${Consts.DROP_DOWN_BUTTON_ACTION_CLASS}), .${Consts.DROP_DOWN_BUTTON_CLASS}`);
    }

    getGeneralToolbarElements() {
        const _$generalToolbar = this.getToolbar().children().first();
        return _$generalToolbar.find(`.${Consts.BUTTON_CLASS}:not(.${Consts.DROP_DOWN_BUTTON_ACTION_CLASS}), .${Consts.DROP_DOWN_BUTTON_CLASS}`);
    }

    getFileSelectionToolbarElements() {
        const _$fileSelectionToolbar = this.getToolbar().children().first().next();
        return _$fileSelectionToolbar.find(`.${Consts.BUTTON_CLASS}:not(.${Consts.DROP_DOWN_BUTTON_ACTION_CLASS}), .${Consts.DROP_DOWN_BUTTON_CLASS}`);
    }

    getToolbarButton(text) {
        return this._$element.find(`.${Consts.TOOLBAR_CLASS} .${Consts.BUTTON_CLASS}:contains('${text}')`);
    }

    getToolbarSeparators() {
        return this._$element.find(`.${Consts.TOOLBAR_CLASS} .${Consts.TOOLBAR_SEPARATOR_ITEM}:visible`);
    }

    getToolbarDropDownButton() {
        return this._$element.find(`.${Consts.DROP_DOWN_BUTTON_CLASS}`);
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

    getToolbarNavigationPaneToggleButton() {
        return this.getToolbarElementsInSection('before').not(`.${Consts.BUTTON_HAS_TEXT_CLASS}`);
    }

    getCustomThumbnails() {
        return this._$element.find(`.${Consts.CUSTOM_THUMBNAIL_CLASS}`);
    }

    getDetailsItemList() {
        return this._$element.find(`.${Consts.ITEMS_GRID_VIEW_CLASS}`);
    }

    getThumbnailsViewPort() {
        return this._$element.find(`.${Consts.THUMBNAILS_VIEW_PORT_CLASS}`);
    }

    getThumbnailsItems() {
        return this._$element.find(`.${Consts.THUMBNAILS_ITEM_CLASS}`);
    }

    getThumbnailsItemName(index) {
        return this.getThumbnailsItems().eq(index).find(`.${Consts.THUMBNAILS_ITEM_NAME_CLASS}`).text();
    }

    getThumbnailsSelectedItems() {
        return this.getThumbnailsItems().filter(`.${Consts.ITEM_SELECTED_CLASS}`);
    }

    findThumbnailsItem(itemName) {
        return this.getThumbnailsItems().filter(`:contains('${itemName}')`);
    }

    getThumbnailsItemContent(itemName) {
        return this.findThumbnailsItem(itemName).find(`.${Consts.THUMBNAILS_ITEM_CONTENT_CLASS}`);
    }

    isThumbnailsItemSelected(itemName) {
        return this.findThumbnailsItem(itemName).is(`.${Consts.ITEM_SELECTED_CLASS}`);
    }

    isThumbnailsItemFocused(itemName) {
        return this.findThumbnailsItem(itemName).is(`.${Consts.FOCUSED_STATE_CLASS}`);
    }

    getThumbnailsViewScrollable() {
        return this.getThumbnailsViewPort().find(`.${Consts.SCROLLABLE_ClASS}`);
    }

    getThumbnailsViewScrollableContainer() {
        return this.getThumbnailsViewScrollable().find(`.${Consts.SCROLLABLE_CONTAINER_ClASS}`);
    }

    findDetailsItem(itemName) {
        return this._$element.find(`.${Consts.GRID_DATA_ROW_CLASS} > td:contains('${itemName}')`);
    }

    getDetailsViewScrollable() {
        return this.getDetailsItemList().find(`.${Consts.SCROLLABLE_ClASS}`);
    }

    getDetailsViewScrollableContainer() {
        return this.getDetailsViewScrollable().find(`.${Consts.SCROLLABLE_CONTAINER_ClASS}`);
    }

    getDetailsItemsNames() {
        return this._$element.find(`.${Consts.DETAILS_ITEM_NAME_CLASS}`);
    }

    getDetailsItemNamesTexts() {
        return this.getDetailsItemsNames()
            .map((_, name) => $(name).text())
            .get();
    }

    getDetailsItemName(index) {
        return this.getDetailsItemsNames().eq(index).text();
    }

    getDetailsItemDateModified(index) {
        return this.getDetailsCell('Date Modified', index).text();
    }

    getDetailsItemSize(index) {
        return this.getDetailsCell('File Size', index).text();
    }

    getRowActionButtonInDetailsView(index) {
        const $row = this.getRowInDetailsView(index);
        return this._findActionButton($row);
    }

    getSelectCheckBoxInDetailsView(index) {
        return this.getRowInDetailsView(index).find('td').eq(0);
    }

    getRowNameCellInDetailsView(index) {
        return this.getDetailsCell('Name', index - 1);
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
        return this._$element.find('[id*=dx-col]').eq(index);
    }

    getDetailsColumnsHeaders() {
        return this.getDetailsItemList().find('.dx-header-row > td');
    }

    getDetailsCell(columnCaption, rowIndex) {
        const $itemList = this.getDetailsItemList();
        const columnIndex = $itemList.find(`.dx-header-row > td:contains('${columnCaption}')`).index();
        const $row = this.getRowInDetailsView(rowIndex + 1);
        return $row.children('td').eq(columnIndex);
    }

    getDetailsCellText(columnCaption, rowIndex) {
        return this.getDetailsCell(columnCaption, rowIndex).text();
    }

    getDetailsCellValue(rowIndex, columnIndex) {
        columnIndex += isDesktopDevice() ? 1 : 0;
        return this.getRowInDetailsView(rowIndex)
            .find(`td:nth-child(${columnIndex})`)
            .text()
            .replace(showMoreButtonText, '');
    }

    getSelectAllCheckBox() {
        const $itemList = this.getDetailsItemList();
        return $itemList.find('.dx-header-row > td.dx-command-select .dx-select-checkbox');
    }

    getSelectAllCheckBoxState() {
        const $checkBox = this.getSelectAllCheckBox();
        if($checkBox.is('.dx-checkbox-indeterminate')) {
            return 'indeterminate';
        } else if($checkBox.is('.dx-checkbox-checked')) {
            return 'checked';
        } else {
            return 'clear';
        }
    }

    getRowSelectCheckBox(index) {
        return this.getRowInDetailsView(index).find('td.dx-command-select .dx-select-checkbox:visible');
    }

    isDetailsRowSelected(index) {
        return this.getRowInDetailsView(index).is(`.${Consts.SELECTION_CLASS}`);
    }

    isDetailsRowFocused(index) {
        return this.getRowInDetailsView(index).is(`.${Consts.FOCUSED_ROW_CLASS}`);
    }

    getContextMenuItems(visible) {
        let selector = `.${Consts.CONTEXT_MENU_CLASS} .${Consts.MENU_ITEM_CLASS}`;
        if(visible) {
            selector += ':visible';
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

    getProgressDrawer() {
        return this._$element.find(`.${Consts.NOTIFICATION_DRAWER_CLASS}`);
    }

    getItemsPanel() {
        return this._$element.find(`.${Consts.CONTAINER_CLASS} .${Consts.DRAWER_CONTENT_CLASS}`);
    }

    moveSplitter(delta, pointerType) {
        const $splitter = this.getSplitter();
        const $drawerContent = this.getDrawerPanelContent();
        if(!pointerType) {
            pointerType = 'mouse';
        }

        $splitter.trigger($.Event('dxpointerdown', { pointerType }));
        const contentRect = $drawerContent[0].getBoundingClientRect();
        $splitter.trigger($.Event('dxpointermove', {
            pointerType,
            pageX: contentRect.right - parseFloat($splitter.css('margin-left')) + delta
        }));

        $splitter.trigger($.Event('dxpointerup', { pointerType }));
    }

    isSplitterActive() {
        return !this.getSplitter().hasClass(Consts.DISABLED_STATE_CLASS);
    }

    getSplitter() {
        return this._$element.find(`.${Consts.SPLITTER_CLASS}`);
    }

    getFolderChooserDialog() {
        return $(`.${Consts.FOLDER_CHOOSER_DIALOG_CLASS} .${Consts.POPUP_NORMAL_CLASS}`);
    }

    getDialogTextInput() {
        return $(`.${Consts.DIALOG_CLASS} .${Consts.TEXT_EDITOR_INPUT_CLASS}`);
    }

    getDialogButton(text) {
        return $(`.${Consts.POPUP_BOTTOM_CLASS} .${Consts.BUTTON_CLASS}:contains('${text}')`);
    }

    getUploadInput() {
        return $(`.${Consts.EDITING_CONTAINER} .${Consts.FILE_UPLOADER_INPUT}`);
    }

    setUploadInputFile(files) {
        const $input = this.getUploadInput();
        $input.val(files[0].name);
        $input.prop('files', files);
        $input.trigger('change');
    }

    getUploaderDropZonePlaceholder() {
        return this._$element.find(`.${Consts.FILE_UPLOADER_DROPZONE_PLACEHOLER_CLASS}`);
    }

}

export class FileManagerProgressPanelWrapper {

    constructor($element) {
        this._$element = $element;
    }

    getInfosContainer() {
        return this._$element.find('.dx-filemanager-progress-panel-infos-container');
    }

    getInfos() {
        return this.getInfosContainer().find('.dx-filemanager-progress-panel-info')
            .map((_, info) => new FileManagerProgressPanelInfoWrapper($(info)))
            .get();
    }

    getSeparators() {
        return this.getInfosContainer().find('.dx-filemanager-progress-panel-separator');
    }

    findProgressBoxes($container) {
        return $container
            .children('.dx-filemanager-progress-box')
            .map((_, element) => new FileManagerProgressPanelProgressBoxWrapper($(element)))
            .get();
    }

    findError($container) {
        return $container.find('.dx-filemanager-progress-box-error');
    }

    get $closeButton() {
        return this._$element.find('.dx-filemanager-progress-panel-close-button');
    }

}

export class FileManagerProgressPanelInfoWrapper {

    constructor($element) {
        this._$element = $element;
    }

    get common() {
        const $common = this._$element.find('.dx-filemanager-progress-panel-common');
        return new FileManagerProgressPanelProgressBoxWrapper($common);
    }

    get details() {
        return this._$element
            .find('.dx-filemanager-progress-panel-details > .dx-filemanager-progress-box')
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
        return this._$element.find('.dx-filemanager-progress-box-common');
    }

    get commonText() {
        return this.$commonText.text();
    }

    get $progressBar() {
        return this._$element.find('.dx-filemanager-progress-box-progress-bar');
    }

    get progressBar() {
        return this.$progressBar.dxProgressBar('instance');
    }

    get progressBarStatusText() {
        return this.$progressBar.find('.dx-progressbar-status').text();
    }

    get progressBarValue() {
        return this.progressBar.option('value');
    }

    get $closeButton() {
        return this._$element.find('.dx-filemanager-progress-box-close-button');
    }

    get closeButton() {
        return this.$closeButton.dxButton('instance');
    }

    get closeButtonVisible() {
        return this.closeButton.option('visible');
    }

    get $image() {
        return this._$element.find('.dx-filemanager-progress-box-image');
    }

    get $error() {
        return this._$element.find('.dx-filemanager-progress-box-error');
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
        let result = '';
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
            .join(',\n');
        return `[ ${content} ]`;
    }

    if(typeof obj !== 'object') {
        return JSON.stringify(obj);
    }

    const props = Object
        .keys(obj)
        .map(key => `${key}: ${stringify(obj[key])}`)
        .join(', ');
    return `{ ${props} }`;
};

export const createTestFileSystem = () => {
    return [
        {
            name: 'Folder 1',
            isDirectory: true,
            items: [
                {
                    name: 'Folder 1.1',
                    isDirectory: true,
                    items: [
                        {
                            name: 'Folder 1.1.1',
                            isDirectory: true,
                            items: [
                                {
                                    name: 'Folder 1.1.1.1',
                                    isDirectory: true,
                                    items: [
                                        {
                                            name: 'Folder 1.1.1.1.1',
                                            isDirectory: true,
                                            items: [
                                                {
                                                    name: 'Special deep file.txt',
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
                            name: 'File 1-1.txt',
                            isDirectory: false
                        },
                        {
                            name: 'File 1-2.txt',
                            isDirectory: false
                        },
                        {
                            name: 'File 1-3.png',
                            isDirectory: false
                        },
                        {
                            name: 'File 1-4.jpg',
                            isDirectory: false
                        }]
                },
                {
                    name: 'Folder 1.2',
                    isDirectory: true
                },
                {
                    name: 'File 1-1.txt',
                    isDirectory: false
                },
                {
                    name: 'File 1-2.jpg',
                    isDirectory: false
                }]
        },
        {
            name: 'Folder 2',
            isDirectory: true,
            items: [
                {
                    name: 'File 2-1.jpg',
                    isDirectory: false
                }]
        },
        {
            name: 'Folder 3',
            isDirectory: true
        },
        {
            name: 'File 1.txt',
            isDirectory: false
        },
        {
            name: 'File 2.jpg',
            isDirectory: false
        },
        {
            name: 'File 3.xml',
            isDirectory: false
        }
    ];
};

export const createHugeFileSystem = () => {
    const result = [];
    for(let i = 0; i < 10; i++) {
        result.push({
            name: `File ${i}.txt`,
            isDirectory: false
        });
    }
    return result;
};

export const createUploaderFiles = count => {
    const result = [];

    for(let i = 0; i < count; i++) {
        const size = 300000 + i * 200000;
        const fileName = `Upload file ${i}.txt`;
        const content = generateString(size, i.toString());

        const file = createFileObject(fileName, content);
        result.push(file);
    }

    return result;
};

export const createSampleFileItems = () => {
    const filesPathInfo = [
        { key: 'Root', name: 'Root' },
        { key: 'Root/Files', name: 'Files' },
    ];

    const itemData = [
        { id: 'Root\\Files\\Documents', name: 'Documents', dateModified: '2019-02-14T07:44:15.4265625Z', isDirectory: true, size: 0, pathInfo: filesPathInfo },
        { id: 'Root\\Files\\Images', name: 'Images', dateModified: '2019-02-14T07:44:15.4885105Z', isDirectory: true, size: 0, pathInfo: filesPathInfo },
        { id: 'Root\\Files\\Music', name: 'Music', dateModified: '2019-02-14T07:44:15.4964648Z', isDirectory: true, size: 0, pathInfo: filesPathInfo },
        { id: 'Root\\Files\\Description.rtf', name: 'Description.rtf', dateModified: '2017-02-09T09:38:46.3772529Z', isDirectory: false, size: 1, pathInfo: filesPathInfo },
        { id: 'Root\\Files\\Article.txt', name: 'Article.txt', dateModified: '2017-02-09T09:38:46.3772529Z', isDirectory: false, size: 1, pathInfo: filesPathInfo }
    ];

    const fileSystemItems = [
        createFileSystemItem(filesPathInfo, itemData[0]),
        createFileSystemItem(filesPathInfo, itemData[1]),
        createFileSystemItem(filesPathInfo, itemData[2]),
        createFileSystemItem(filesPathInfo, itemData[3]),
        createFileSystemItem(filesPathInfo, itemData[4])
    ];

    return { filesPathInfo, itemData, fileSystemItems };
};

const createFileSystemItem = (parentPath, dataObj) => {
    const item = new FileSystemItem(parentPath, dataObj.name, dataObj.isDirectory);
    item.dateModified = deserializeDate(dataObj.dateModified);
    item.size = dataObj.size;
    item.dataItem = dataObj;
    if(dataObj.isDirectory) {
        item.hasSubDirectories = true;
    }
    return item;
};

export const createFileObject = (fileName, content) => {
    const result = new window.Blob([content], { type: 'application/octet-stream' });
    result.name = fileName;
    result.lastModified = (new Date()).getTime();
    result._dxContent = content;
    return result;
};

export const generateString = (size, content) => {
    if(!size) {
        return '';
    }

    let result = content;

    if(result === undefined) {
        result = 'A';
    }

    if(result.length < size) {
        const count = Math.ceil(size / result.length);
        result = new Array(count + 1).join(result);
    }

    if(result.length > size) {
        result = result.substr(0, size);
    }

    return result;
};

export const createUploadInfo = (file, chunkIndex, customData, chunkSize) => {
    chunkIndex = chunkIndex || 0;
    customData = customData || {};
    chunkSize = chunkSize || 200000;

    const bytesUploaded = chunkIndex * chunkSize;
    const chunkCount = Math.ceil(file.size / chunkSize);
    const chunkBlob = file.slice(bytesUploaded, Math.min(file.size, bytesUploaded + chunkSize));

    return { bytesUploaded, chunkCount, customData, chunkBlob, chunkIndex };
};

export const stubFileReader = object => {
    sinon.stub(object, '_createFileReader', () => new FileReaderMock());
};

export const isDesktopDevice = () => {
    return devices.real().deviceType === 'desktop';
};

export const getDropFileEvent = file => $.Event($.Event('drop', { dataTransfer: { files: [file] } }));
