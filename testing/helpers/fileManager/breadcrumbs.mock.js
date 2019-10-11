import $ from "jquery";
import FileManagerBreadcrumbs from "ui/file_manager/ui.file_manager.breadcrumbs";

const MENU_ITEM_WITH_TEXT_CLASS = "dx-menu-item-has-text";
const BREADCRUMBS_PARENT_DIRECOTRY_ITEM_CLASS = "dx-filemanager-breadcrumbs-parent-folder-item";

export default class FileManagerBreadcrumbsMock extends FileManagerBreadcrumbs {
    _init() {
        super._init();
    }

    _initMarkup() {
        super._initMarkup();
    }

    getItemsWithText() {
        return this._menu._dataAdapter.options.items.filter(item => item.isPathItem && item.text);
    }

    getPath() {
        return this.getItemsWithText().map(item => item.text).join("/");
    }

    getItemByText(text) {
        const $elements = this._menu._$element.find(`.${MENU_ITEM_WITH_TEXT_CLASS}`);
        const firstElement = $elements.filter(function() { return $(this).text() === text; }).first();
        return $(firstElement);
    }

    getParentDirectoryItem() {
        return $(this._$element.find(`.${BREADCRUMBS_PARENT_DIRECOTRY_ITEM_CLASS}`));
    }

}
