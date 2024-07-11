"use strict";

exports.default = void 0;
var _renderer = _interopRequireDefault(require("../../core/renderer"));
var _extend = require("../../core/utils/extend");
var _message = _interopRequireDefault(require("../../localization/message"));
var _uiFile_manager = require("./ui.file_manager.common");
var _uiFile_manager2 = _interopRequireDefault(require("./ui.file_manager.dialog"));
var _uiFile_manager3 = _interopRequireDefault(require("./ui.file_manager.files_tree_view"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const FILE_MANAGER_DIALOG_FOLDER_CHOOSER = 'dx-filemanager-dialog-folder-chooser';
const FILE_MANAGER_DIALOG_FOLDER_CHOOSER_POPUP = 'dx-filemanager-dialog-folder-chooser-popup';
class FileManagerFolderChooserDialog extends _uiFile_manager2.default {
  show() {
    var _this$_filesTreeView;
    this._setSelectedDirInfo(null);
    (_this$_filesTreeView = this._filesTreeView) === null || _this$_filesTreeView === void 0 || _this$_filesTreeView.refresh();
    super.show();
  }
  switchToCopyDialog(targetItemInfos) {
    this._targetItemInfos = targetItemInfos;
    this._setTitle(_message.default.format('dxFileManager-dialogDirectoryChooserCopyTitle'));
    this._setApplyButtonOptions({
      text: _message.default.format('dxFileManager-dialogDirectoryChooserCopyButtonText'),
      disabled: true
    });
  }
  switchToMoveDialog(targetItemInfos) {
    this._targetItemInfos = targetItemInfos;
    this._setTitle(_message.default.format('dxFileManager-dialogDirectoryChooserMoveTitle'));
    this._setApplyButtonOptions({
      text: _message.default.format('dxFileManager-dialogDirectoryChooserMoveButtonText'),
      disabled: true
    });
  }
  _getDialogOptions() {
    return (0, _extend.extend)(super._getDialogOptions(), {
      contentCssClass: FILE_MANAGER_DIALOG_FOLDER_CHOOSER,
      popupCssClass: FILE_MANAGER_DIALOG_FOLDER_CHOOSER_POPUP
    });
  }
  _createContentTemplate(element) {
    super._createContentTemplate(element);
    this._filesTreeView = this._createComponent((0, _renderer.default)('<div>'), _uiFile_manager3.default, {
      getDirectories: this.option('getDirectories'),
      getCurrentDirectory: () => this._getDialogSelectedDirectory(),
      onDirectoryClick: e => this._onFilesTreeViewDirectoryClick(e),
      onFilesTreeViewContentReady: () => this._toggleUnavailableLocationsDisabled(true)
    });
    this._$contentElement.append(this._filesTreeView.$element());
  }
  _getDialogResult() {
    const result = this._getDialogSelectedDirectory();
    return result ? {
      folder: result
    } : result;
  }
  _getDefaultOptions() {
    return (0, _extend.extend)(super._getDefaultOptions(), {
      getItems: null
    });
  }
  _getDialogSelectedDirectory() {
    return this._selectedDirectoryInfo;
  }
  _onFilesTreeViewDirectoryClick(_ref) {
    let {
      itemData
    } = _ref;
    this._setSelectedDirInfo(itemData);
    this._filesTreeView.updateCurrentDirectory();
  }
  _setSelectedDirInfo(dirInfo) {
    this._selectedDirectoryInfo = dirInfo;
    this._setApplyButtonOptions({
      disabled: !dirInfo
    });
  }
  _onPopupShown() {
    this._toggleUnavailableLocationsDisabled(true);
    super._onPopupShown();
  }
  _onPopupHiding() {
    this._toggleUnavailableLocationsDisabled(false);
    super._onPopupHiding();
  }
  _toggleUnavailableLocationsDisabled(isDisabled) {
    if (!this._filesTreeView) {
      return;
    }
    const locations = this._getLocationsToProcess(isDisabled);
    this._filesTreeView.toggleDirectoryExpandedStateRecursive(locations.locationsToExpand[0], isDisabled).then(() => this._filesTreeView.toggleDirectoryLineExpandedState(locations.locationsToCollapse, !isDisabled).then(() => locations.locationKeysToDisable.forEach(key => this._filesTreeView.toggleNodeDisabledState(key, isDisabled))));
  }
  _getLocationsToProcess(isDisabled) {
    const expandLocations = {};
    const collapseLocations = {};
    this._targetItemInfos.forEach(itemInfo => {
      if (itemInfo.parentDirectory) {
        expandLocations[itemInfo.parentDirectory.getInternalKey()] = itemInfo.parentDirectory;
      }
      if (itemInfo.fileItem.isDirectory) {
        collapseLocations[itemInfo.getInternalKey()] = itemInfo;
      }
    });
    const expandMap = (0, _uiFile_manager.getMapFromObject)(expandLocations);
    const collapseMap = (0, _uiFile_manager.getMapFromObject)(collapseLocations);
    return {
      locationsToExpand: isDisabled ? expandMap.values : [],
      locationsToCollapse: isDisabled ? collapseMap.values : [],
      locationKeysToDisable: expandMap.keys.concat(...collapseMap.keys)
    };
  }
}
var _default = exports.default = FileManagerFolderChooserDialog;
module.exports = exports.default;
module.exports.default = exports.default;