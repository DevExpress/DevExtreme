System.register(['@angular/platform-browser', '@angular/core', 'devextreme/ui/file_manager', './devextreme-angular-core.js', './devextreme-angular-ui-nested.js', '@angular/common', 'devextreme/core/dom_adapter', 'devextreme/events', 'devextreme/core/utils/common', 'devextreme/core/renderer', 'devextreme/core/http_request', 'devextreme/core/utils/ready_callbacks', 'devextreme/events/core/events_engine', 'devextreme/core/utils/ajax', 'devextreme/core/utils/deferred'], (function (exports) {
    'use strict';
    var i2, i0, PLATFORM_ID, Component, Inject, Input, Output, NgModule, DxFileManager, DxComponent, DxTemplateHost, WatcherHelper, IterableDifferHelper, NestedOptionHost, DxIntegrationModule, DxTemplateModule, DxoContextMenuModule, DxiItemModule, DxoItemViewModule, DxoDetailsModule, DxiColumnModule, DxoNotificationsModule, DxoPermissionsModule, DxoToolbarModule, DxiFileSelectionItemModule, DxoUploadModule;
    return {
        setters: [function (module) {
            i2 = module;
        }, function (module) {
            i0 = module;
            PLATFORM_ID = module.PLATFORM_ID;
            Component = module.Component;
            Inject = module.Inject;
            Input = module.Input;
            Output = module.Output;
            NgModule = module.NgModule;
        }, function (module) {
            DxFileManager = module.default;
        }, function (module) {
            DxComponent = module.c;
            DxTemplateHost = module.h;
            WatcherHelper = module.W;
            IterableDifferHelper = module.I;
            NestedOptionHost = module.i;
            DxIntegrationModule = module.e;
            DxTemplateModule = module.D;
        }, function (module) {
            DxoContextMenuModule = module.DxoContextMenuModule;
            DxiItemModule = module.DxiItemModule;
            DxoItemViewModule = module.DxoItemViewModule;
            DxoDetailsModule = module.DxoDetailsModule;
            DxiColumnModule = module.DxiColumnModule;
            DxoNotificationsModule = module.DxoNotificationsModule;
            DxoPermissionsModule = module.DxoPermissionsModule;
            DxoToolbarModule = module.DxoToolbarModule;
            DxiFileSelectionItemModule = module.DxiFileSelectionItemModule;
            DxoUploadModule = module.DxoUploadModule;
        }, null, null, null, null, null, null, null, null, null, null],
        execute: (function () {

            /*!
             * devextreme-angular
             * Version: 24.1.1
             * Build date: Mon Apr 15 2024
             *
             * Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
             *
             * This software may be modified and distributed under the terms
             * of the MIT license. See the LICENSE file in the root of the project for details.
             *
             * https://github.com/DevExpress/devextreme-angular
             */
            /* tslint:disable:max-line-length */
            /**
             * The FileManager is a UI component that allows users to upload, select, and manage files and directories in different file storages.

             */
            class DxFileManagerComponent extends DxComponent {
                _watcherHelper;
                _idh;
                instance = null;
                /**
                 * Specifies the shortcut key that sets focus on the UI component.
                
                 */
                get accessKey() {
                    return this._getOption('accessKey');
                }
                set accessKey(value) {
                    this._setOption('accessKey', value);
                }
                /**
                 * Specifies whether the UI component changes its visual state as a result of user interaction.
                
                 */
                get activeStateEnabled() {
                    return this._getOption('activeStateEnabled');
                }
                set activeStateEnabled(value) {
                    this._setOption('activeStateEnabled', value);
                }
                /**
                 * Specifies the allowed upload file extensions.
                
                 */
                get allowedFileExtensions() {
                    return this._getOption('allowedFileExtensions');
                }
                set allowedFileExtensions(value) {
                    this._setOption('allowedFileExtensions', value);
                }
                /**
                 * Configures the context menu settings.
                
                 */
                get contextMenu() {
                    return this._getOption('contextMenu');
                }
                set contextMenu(value) {
                    this._setOption('contextMenu', value);
                }
                /**
                 * Specifies the path that is used when the FileManager is initialized.
                
                 */
                get currentPath() {
                    return this._getOption('currentPath');
                }
                set currentPath(value) {
                    this._setOption('currentPath', value);
                }
                /**
                 * Specifies an array of path keys to the current location.
                
                 */
                get currentPathKeys() {
                    return this._getOption('currentPathKeys');
                }
                set currentPathKeys(value) {
                    this._setOption('currentPathKeys', value);
                }
                /**
                 * Customizes columns in details view. Applies only if itemView.mode is &apos;details&apos;.
                
                 */
                get customizeDetailColumns() {
                    return this._getOption('customizeDetailColumns');
                }
                set customizeDetailColumns(value) {
                    this._setOption('customizeDetailColumns', value);
                }
                /**
                 * Allows you to provide custom icons to be used as thumbnails.
                
                 */
                get customizeThumbnail() {
                    return this._getOption('customizeThumbnail');
                }
                set customizeThumbnail(value) {
                    this._setOption('customizeThumbnail', value);
                }
                /**
                 * Specifies whether the UI component responds to user interaction.
                
                 */
                get disabled() {
                    return this._getOption('disabled');
                }
                set disabled(value) {
                    this._setOption('disabled', value);
                }
                /**
                 * Specifies the global attributes to be attached to the UI component&apos;s container element.
                
                 */
                get elementAttr() {
                    return this._getOption('elementAttr');
                }
                set elementAttr(value) {
                    this._setOption('elementAttr', value);
                }
                /**
                 * Specifies the file system provider.
                
                 */
                get fileSystemProvider() {
                    return this._getOption('fileSystemProvider');
                }
                set fileSystemProvider(value) {
                    this._setOption('fileSystemProvider', value);
                }
                /**
                 * Specifies a key of the initially or currently focused item.
                
                 */
                get focusedItemKey() {
                    return this._getOption('focusedItemKey');
                }
                set focusedItemKey(value) {
                    this._setOption('focusedItemKey', value);
                }
                /**
                 * Specifies whether the UI component can be focused using keyboard navigation.
                
                 */
                get focusStateEnabled() {
                    return this._getOption('focusStateEnabled');
                }
                set focusStateEnabled(value) {
                    this._setOption('focusStateEnabled', value);
                }
                /**
                 * Specifies the UI component&apos;s height.
                
                 */
                get height() {
                    return this._getOption('height');
                }
                set height(value) {
                    this._setOption('height', value);
                }
                /**
                 * Specifies text for a hint that appears when a user pauses on the UI component.
                
                 */
                get hint() {
                    return this._getOption('hint');
                }
                set hint(value) {
                    this._setOption('hint', value);
                }
                /**
                 * Specifies whether the UI component changes its state when a user pauses on it.
                
                 */
                get hoverStateEnabled() {
                    return this._getOption('hoverStateEnabled');
                }
                set hoverStateEnabled(value) {
                    this._setOption('hoverStateEnabled', value);
                }
                /**
                 * Configures the file and directory view.
                
                 */
                get itemView() {
                    return this._getOption('itemView');
                }
                set itemView(value) {
                    this._setOption('itemView', value);
                }
                /**
                 * Configures notification settings.
                
                 */
                get notifications() {
                    return this._getOption('notifications');
                }
                set notifications(value) {
                    this._setOption('notifications', value);
                }
                /**
                 * Specifies actions that a user is allowed to perform on files and directories.
                
                 */
                get permissions() {
                    return this._getOption('permissions');
                }
                set permissions(value) {
                    this._setOption('permissions', value);
                }
                /**
                 * Specifies the root directory display name.
                
                 */
                get rootFolderName() {
                    return this._getOption('rootFolderName');
                }
                set rootFolderName(value) {
                    this._setOption('rootFolderName', value);
                }
                /**
                 * Switches the UI component to a right-to-left representation.
                
                 */
                get rtlEnabled() {
                    return this._getOption('rtlEnabled');
                }
                set rtlEnabled(value) {
                    this._setOption('rtlEnabled', value);
                }
                /**
                 * Contains an array of initially or currently selected files and directories&apos; keys.
                
                 */
                get selectedItemKeys() {
                    return this._getOption('selectedItemKeys');
                }
                set selectedItemKeys(value) {
                    this._setOption('selectedItemKeys', value);
                }
                /**
                 * Specifies whether a user can select a single or multiple files and directories in the item view simultaneously.
                
                 */
                get selectionMode() {
                    return this._getOption('selectionMode');
                }
                set selectionMode(value) {
                    this._setOption('selectionMode', value);
                }
                /**
                 * Specifies the number of the element when the Tab key is used for navigating.
                
                 */
                get tabIndex() {
                    return this._getOption('tabIndex');
                }
                set tabIndex(value) {
                    this._setOption('tabIndex', value);
                }
                /**
                 * Configures toolbar settings.
                
                 */
                get toolbar() {
                    return this._getOption('toolbar');
                }
                set toolbar(value) {
                    this._setOption('toolbar', value);
                }
                /**
                 * Configures upload settings.
                
                 */
                get upload() {
                    return this._getOption('upload');
                }
                set upload(value) {
                    this._setOption('upload', value);
                }
                /**
                 * Specifies whether the UI component is visible.
                
                 */
                get visible() {
                    return this._getOption('visible');
                }
                set visible(value) {
                    this._setOption('visible', value);
                }
                /**
                 * Specifies the UI component&apos;s width.
                
                 */
                get width() {
                    return this._getOption('width');
                }
                set width(value) {
                    this._setOption('width', value);
                }
                /**
                
                 * A function that is executed when the UI component is rendered and each time the component is repainted.
                
                
                 */
                onContentReady;
                /**
                
                 * A function that is executed when a context menu item is clicked.
                
                
                 */
                onContextMenuItemClick;
                /**
                
                 * A function that is executed before a context menu is displayed.
                
                
                 */
                onContextMenuShowing;
                /**
                
                 * A function that is executed when the current directory is changed.
                
                
                 */
                onCurrentDirectoryChanged;
                /**
                
                 * A function that is executed when a directory is created.
                
                
                 */
                onDirectoryCreated;
                /**
                
                 * A function that is executed before a directory is created.
                
                
                 */
                onDirectoryCreating;
                /**
                
                 * A function that is executed before the UI component is disposed of.
                
                
                 */
                onDisposing;
                /**
                
                 * A function that is executed when an error occurs.
                
                
                 */
                onErrorOccurred;
                /**
                
                 * A function that is executed when a file is successfully uploaded.
                
                
                 */
                onFileUploaded;
                /**
                
                 * A function that is executed before the file is uploaded.
                
                
                 */
                onFileUploading;
                /**
                
                 * A function that is executed when the focused item is changed.
                
                
                 */
                onFocusedItemChanged;
                /**
                
                 * A function used in JavaScript frameworks to save the UI component instance.
                
                
                 */
                onInitialized;
                /**
                
                 * A function that is executed when a file or directory is copied.
                
                
                 */
                onItemCopied;
                /**
                
                 * A function that is executed before a file or directory is copied.
                
                
                 */
                onItemCopying;
                /**
                
                 * A function that is executed when a file or directory is deleted.
                
                
                 */
                onItemDeleted;
                /**
                
                 * A function that is executed before a file or directory is deleted.
                
                
                 */
                onItemDeleting;
                /**
                
                 * A function that is executed before a file is downloaded.
                
                
                 */
                onItemDownloading;
                /**
                
                 * A function that is executed when a file or directory is moved.
                
                
                 */
                onItemMoved;
                /**
                
                 * A function that is executed before a file or directory is moved.
                
                
                 */
                onItemMoving;
                /**
                
                 * A function that is executed when a file or directory is renamed.
                
                
                 */
                onItemRenamed;
                /**
                
                 * A function that is executed before a file or directory is renamed.
                
                
                 */
                onItemRenaming;
                /**
                
                 * A function that is executed after a UI component property is changed.
                
                
                 */
                onOptionChanged;
                /**
                
                 * A function that is executed when the selected file is opened.
                
                
                 */
                onSelectedFileOpened;
                /**
                
                 * A function that is executed when a file system item is selected or selection is canceled.
                
                
                 */
                onSelectionChanged;
                /**
                
                 * A function that is executed when a toolbar item is clicked.
                
                
                 */
                onToolbarItemClick;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                accessKeyChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                activeStateEnabledChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                allowedFileExtensionsChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                contextMenuChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                currentPathChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                currentPathKeysChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                customizeDetailColumnsChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                customizeThumbnailChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                disabledChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                elementAttrChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                fileSystemProviderChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                focusedItemKeyChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                focusStateEnabledChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                heightChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                hintChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                hoverStateEnabledChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                itemViewChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                notificationsChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                permissionsChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                rootFolderNameChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                rtlEnabledChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                selectedItemKeysChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                selectionModeChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                tabIndexChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                toolbarChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                uploadChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                visibleChange;
                /**
                
                 * This member supports the internal infrastructure and is not intended to be used directly from your code.
                
                 */
                widthChange;
                constructor(elementRef, ngZone, templateHost, _watcherHelper, _idh, optionHost, transferState, platformId) {
                    super(elementRef, ngZone, templateHost, _watcherHelper, transferState, platformId);
                    this._watcherHelper = _watcherHelper;
                    this._idh = _idh;
                    this._createEventEmitters([
                        { subscribe: 'contentReady', emit: 'onContentReady' },
                        { subscribe: 'contextMenuItemClick', emit: 'onContextMenuItemClick' },
                        { subscribe: 'contextMenuShowing', emit: 'onContextMenuShowing' },
                        { subscribe: 'currentDirectoryChanged', emit: 'onCurrentDirectoryChanged' },
                        { subscribe: 'directoryCreated', emit: 'onDirectoryCreated' },
                        { subscribe: 'directoryCreating', emit: 'onDirectoryCreating' },
                        { subscribe: 'disposing', emit: 'onDisposing' },
                        { subscribe: 'errorOccurred', emit: 'onErrorOccurred' },
                        { subscribe: 'fileUploaded', emit: 'onFileUploaded' },
                        { subscribe: 'fileUploading', emit: 'onFileUploading' },
                        { subscribe: 'focusedItemChanged', emit: 'onFocusedItemChanged' },
                        { subscribe: 'initialized', emit: 'onInitialized' },
                        { subscribe: 'itemCopied', emit: 'onItemCopied' },
                        { subscribe: 'itemCopying', emit: 'onItemCopying' },
                        { subscribe: 'itemDeleted', emit: 'onItemDeleted' },
                        { subscribe: 'itemDeleting', emit: 'onItemDeleting' },
                        { subscribe: 'itemDownloading', emit: 'onItemDownloading' },
                        { subscribe: 'itemMoved', emit: 'onItemMoved' },
                        { subscribe: 'itemMoving', emit: 'onItemMoving' },
                        { subscribe: 'itemRenamed', emit: 'onItemRenamed' },
                        { subscribe: 'itemRenaming', emit: 'onItemRenaming' },
                        { subscribe: 'optionChanged', emit: 'onOptionChanged' },
                        { subscribe: 'selectedFileOpened', emit: 'onSelectedFileOpened' },
                        { subscribe: 'selectionChanged', emit: 'onSelectionChanged' },
                        { subscribe: 'toolbarItemClick', emit: 'onToolbarItemClick' },
                        { emit: 'accessKeyChange' },
                        { emit: 'activeStateEnabledChange' },
                        { emit: 'allowedFileExtensionsChange' },
                        { emit: 'contextMenuChange' },
                        { emit: 'currentPathChange' },
                        { emit: 'currentPathKeysChange' },
                        { emit: 'customizeDetailColumnsChange' },
                        { emit: 'customizeThumbnailChange' },
                        { emit: 'disabledChange' },
                        { emit: 'elementAttrChange' },
                        { emit: 'fileSystemProviderChange' },
                        { emit: 'focusedItemKeyChange' },
                        { emit: 'focusStateEnabledChange' },
                        { emit: 'heightChange' },
                        { emit: 'hintChange' },
                        { emit: 'hoverStateEnabledChange' },
                        { emit: 'itemViewChange' },
                        { emit: 'notificationsChange' },
                        { emit: 'permissionsChange' },
                        { emit: 'rootFolderNameChange' },
                        { emit: 'rtlEnabledChange' },
                        { emit: 'selectedItemKeysChange' },
                        { emit: 'selectionModeChange' },
                        { emit: 'tabIndexChange' },
                        { emit: 'toolbarChange' },
                        { emit: 'uploadChange' },
                        { emit: 'visibleChange' },
                        { emit: 'widthChange' }
                    ]);
                    this._idh.setHost(this);
                    optionHost.setHost(this);
                }
                _createInstance(element, options) {
                    return new DxFileManager(element, options);
                }
                ngOnDestroy() {
                    this._destroyWidget();
                }
                ngOnChanges(changes) {
                    super.ngOnChanges(changes);
                    this.setupChanges('allowedFileExtensions', changes);
                    this.setupChanges('currentPathKeys', changes);
                    this.setupChanges('selectedItemKeys', changes);
                }
                setupChanges(prop, changes) {
                    if (!(prop in this._optionsToUpdate)) {
                        this._idh.setup(prop, changes);
                    }
                }
                ngDoCheck() {
                    this._idh.doCheck('allowedFileExtensions');
                    this._idh.doCheck('currentPathKeys');
                    this._idh.doCheck('selectedItemKeys');
                    this._watcherHelper.checkWatchers();
                    super.ngDoCheck();
                    super.clearChangedOptions();
                }
                _setOption(name, value) {
                    let isSetup = this._idh.setupSingle(name, value);
                    let isChanged = this._idh.getChanges(name, value) !== null;
                    if (isSetup || isChanged) {
                        super._setOption(name, value);
                    }
                }
                /** @nocollapse */ static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxFileManagerComponent, deps: [{ token: i0.ElementRef }, { token: i0.NgZone }, { token: DxTemplateHost }, { token: WatcherHelper }, { token: IterableDifferHelper }, { token: NestedOptionHost }, { token: i2.TransferState }, { token: PLATFORM_ID }], target: i0.ɵɵFactoryTarget.Component });
                /** @nocollapse */ static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "17.3.0", type: DxFileManagerComponent, selector: "dx-file-manager", inputs: { accessKey: "accessKey", activeStateEnabled: "activeStateEnabled", allowedFileExtensions: "allowedFileExtensions", contextMenu: "contextMenu", currentPath: "currentPath", currentPathKeys: "currentPathKeys", customizeDetailColumns: "customizeDetailColumns", customizeThumbnail: "customizeThumbnail", disabled: "disabled", elementAttr: "elementAttr", fileSystemProvider: "fileSystemProvider", focusedItemKey: "focusedItemKey", focusStateEnabled: "focusStateEnabled", height: "height", hint: "hint", hoverStateEnabled: "hoverStateEnabled", itemView: "itemView", notifications: "notifications", permissions: "permissions", rootFolderName: "rootFolderName", rtlEnabled: "rtlEnabled", selectedItemKeys: "selectedItemKeys", selectionMode: "selectionMode", tabIndex: "tabIndex", toolbar: "toolbar", upload: "upload", visible: "visible", width: "width" }, outputs: { onContentReady: "onContentReady", onContextMenuItemClick: "onContextMenuItemClick", onContextMenuShowing: "onContextMenuShowing", onCurrentDirectoryChanged: "onCurrentDirectoryChanged", onDirectoryCreated: "onDirectoryCreated", onDirectoryCreating: "onDirectoryCreating", onDisposing: "onDisposing", onErrorOccurred: "onErrorOccurred", onFileUploaded: "onFileUploaded", onFileUploading: "onFileUploading", onFocusedItemChanged: "onFocusedItemChanged", onInitialized: "onInitialized", onItemCopied: "onItemCopied", onItemCopying: "onItemCopying", onItemDeleted: "onItemDeleted", onItemDeleting: "onItemDeleting", onItemDownloading: "onItemDownloading", onItemMoved: "onItemMoved", onItemMoving: "onItemMoving", onItemRenamed: "onItemRenamed", onItemRenaming: "onItemRenaming", onOptionChanged: "onOptionChanged", onSelectedFileOpened: "onSelectedFileOpened", onSelectionChanged: "onSelectionChanged", onToolbarItemClick: "onToolbarItemClick", accessKeyChange: "accessKeyChange", activeStateEnabledChange: "activeStateEnabledChange", allowedFileExtensionsChange: "allowedFileExtensionsChange", contextMenuChange: "contextMenuChange", currentPathChange: "currentPathChange", currentPathKeysChange: "currentPathKeysChange", customizeDetailColumnsChange: "customizeDetailColumnsChange", customizeThumbnailChange: "customizeThumbnailChange", disabledChange: "disabledChange", elementAttrChange: "elementAttrChange", fileSystemProviderChange: "fileSystemProviderChange", focusedItemKeyChange: "focusedItemKeyChange", focusStateEnabledChange: "focusStateEnabledChange", heightChange: "heightChange", hintChange: "hintChange", hoverStateEnabledChange: "hoverStateEnabledChange", itemViewChange: "itemViewChange", notificationsChange: "notificationsChange", permissionsChange: "permissionsChange", rootFolderNameChange: "rootFolderNameChange", rtlEnabledChange: "rtlEnabledChange", selectedItemKeysChange: "selectedItemKeysChange", selectionModeChange: "selectionModeChange", tabIndexChange: "tabIndexChange", toolbarChange: "toolbarChange", uploadChange: "uploadChange", visibleChange: "visibleChange", widthChange: "widthChange" }, providers: [
                        DxTemplateHost,
                        WatcherHelper,
                        NestedOptionHost,
                        IterableDifferHelper
                    ], usesInheritance: true, usesOnChanges: true, ngImport: i0, template: '', isInline: true });
            } exports("DxFileManagerComponent", DxFileManagerComponent);
            i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxFileManagerComponent, decorators: [{
                        type: Component,
                        args: [{
                                selector: 'dx-file-manager',
                                template: '',
                                providers: [
                                    DxTemplateHost,
                                    WatcherHelper,
                                    NestedOptionHost,
                                    IterableDifferHelper
                                ]
                            }]
                    }], ctorParameters: () => [{ type: i0.ElementRef }, { type: i0.NgZone }, { type: DxTemplateHost }, { type: WatcherHelper }, { type: IterableDifferHelper }, { type: NestedOptionHost }, { type: i2.TransferState }, { type: undefined, decorators: [{
                                type: Inject,
                                args: [PLATFORM_ID]
                            }] }], propDecorators: { accessKey: [{
                            type: Input
                        }], activeStateEnabled: [{
                            type: Input
                        }], allowedFileExtensions: [{
                            type: Input
                        }], contextMenu: [{
                            type: Input
                        }], currentPath: [{
                            type: Input
                        }], currentPathKeys: [{
                            type: Input
                        }], customizeDetailColumns: [{
                            type: Input
                        }], customizeThumbnail: [{
                            type: Input
                        }], disabled: [{
                            type: Input
                        }], elementAttr: [{
                            type: Input
                        }], fileSystemProvider: [{
                            type: Input
                        }], focusedItemKey: [{
                            type: Input
                        }], focusStateEnabled: [{
                            type: Input
                        }], height: [{
                            type: Input
                        }], hint: [{
                            type: Input
                        }], hoverStateEnabled: [{
                            type: Input
                        }], itemView: [{
                            type: Input
                        }], notifications: [{
                            type: Input
                        }], permissions: [{
                            type: Input
                        }], rootFolderName: [{
                            type: Input
                        }], rtlEnabled: [{
                            type: Input
                        }], selectedItemKeys: [{
                            type: Input
                        }], selectionMode: [{
                            type: Input
                        }], tabIndex: [{
                            type: Input
                        }], toolbar: [{
                            type: Input
                        }], upload: [{
                            type: Input
                        }], visible: [{
                            type: Input
                        }], width: [{
                            type: Input
                        }], onContentReady: [{
                            type: Output
                        }], onContextMenuItemClick: [{
                            type: Output
                        }], onContextMenuShowing: [{
                            type: Output
                        }], onCurrentDirectoryChanged: [{
                            type: Output
                        }], onDirectoryCreated: [{
                            type: Output
                        }], onDirectoryCreating: [{
                            type: Output
                        }], onDisposing: [{
                            type: Output
                        }], onErrorOccurred: [{
                            type: Output
                        }], onFileUploaded: [{
                            type: Output
                        }], onFileUploading: [{
                            type: Output
                        }], onFocusedItemChanged: [{
                            type: Output
                        }], onInitialized: [{
                            type: Output
                        }], onItemCopied: [{
                            type: Output
                        }], onItemCopying: [{
                            type: Output
                        }], onItemDeleted: [{
                            type: Output
                        }], onItemDeleting: [{
                            type: Output
                        }], onItemDownloading: [{
                            type: Output
                        }], onItemMoved: [{
                            type: Output
                        }], onItemMoving: [{
                            type: Output
                        }], onItemRenamed: [{
                            type: Output
                        }], onItemRenaming: [{
                            type: Output
                        }], onOptionChanged: [{
                            type: Output
                        }], onSelectedFileOpened: [{
                            type: Output
                        }], onSelectionChanged: [{
                            type: Output
                        }], onToolbarItemClick: [{
                            type: Output
                        }], accessKeyChange: [{
                            type: Output
                        }], activeStateEnabledChange: [{
                            type: Output
                        }], allowedFileExtensionsChange: [{
                            type: Output
                        }], contextMenuChange: [{
                            type: Output
                        }], currentPathChange: [{
                            type: Output
                        }], currentPathKeysChange: [{
                            type: Output
                        }], customizeDetailColumnsChange: [{
                            type: Output
                        }], customizeThumbnailChange: [{
                            type: Output
                        }], disabledChange: [{
                            type: Output
                        }], elementAttrChange: [{
                            type: Output
                        }], fileSystemProviderChange: [{
                            type: Output
                        }], focusedItemKeyChange: [{
                            type: Output
                        }], focusStateEnabledChange: [{
                            type: Output
                        }], heightChange: [{
                            type: Output
                        }], hintChange: [{
                            type: Output
                        }], hoverStateEnabledChange: [{
                            type: Output
                        }], itemViewChange: [{
                            type: Output
                        }], notificationsChange: [{
                            type: Output
                        }], permissionsChange: [{
                            type: Output
                        }], rootFolderNameChange: [{
                            type: Output
                        }], rtlEnabledChange: [{
                            type: Output
                        }], selectedItemKeysChange: [{
                            type: Output
                        }], selectionModeChange: [{
                            type: Output
                        }], tabIndexChange: [{
                            type: Output
                        }], toolbarChange: [{
                            type: Output
                        }], uploadChange: [{
                            type: Output
                        }], visibleChange: [{
                            type: Output
                        }], widthChange: [{
                            type: Output
                        }] } });
            class DxFileManagerModule {
                /** @nocollapse */ static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxFileManagerModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
                /** @nocollapse */ static ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "17.3.0", ngImport: i0, type: DxFileManagerModule, declarations: [DxFileManagerComponent], imports: [DxoContextMenuModule,
                        DxiItemModule,
                        DxoItemViewModule,
                        DxoDetailsModule,
                        DxiColumnModule,
                        DxoNotificationsModule,
                        DxoPermissionsModule,
                        DxoToolbarModule,
                        DxiFileSelectionItemModule,
                        DxoUploadModule,
                        DxIntegrationModule,
                        DxTemplateModule], exports: [DxFileManagerComponent, DxoContextMenuModule,
                        DxiItemModule,
                        DxoItemViewModule,
                        DxoDetailsModule,
                        DxiColumnModule,
                        DxoNotificationsModule,
                        DxoPermissionsModule,
                        DxoToolbarModule,
                        DxiFileSelectionItemModule,
                        DxoUploadModule,
                        DxTemplateModule] });
                /** @nocollapse */ static ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxFileManagerModule, imports: [DxoContextMenuModule,
                        DxiItemModule,
                        DxoItemViewModule,
                        DxoDetailsModule,
                        DxiColumnModule,
                        DxoNotificationsModule,
                        DxoPermissionsModule,
                        DxoToolbarModule,
                        DxiFileSelectionItemModule,
                        DxoUploadModule,
                        DxIntegrationModule,
                        DxTemplateModule, DxoContextMenuModule,
                        DxiItemModule,
                        DxoItemViewModule,
                        DxoDetailsModule,
                        DxiColumnModule,
                        DxoNotificationsModule,
                        DxoPermissionsModule,
                        DxoToolbarModule,
                        DxiFileSelectionItemModule,
                        DxoUploadModule,
                        DxTemplateModule] });
            } exports("DxFileManagerModule", DxFileManagerModule);
            i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.0", ngImport: i0, type: DxFileManagerModule, decorators: [{
                        type: NgModule,
                        args: [{
                                imports: [
                                    DxoContextMenuModule,
                                    DxiItemModule,
                                    DxoItemViewModule,
                                    DxoDetailsModule,
                                    DxiColumnModule,
                                    DxoNotificationsModule,
                                    DxoPermissionsModule,
                                    DxoToolbarModule,
                                    DxiFileSelectionItemModule,
                                    DxoUploadModule,
                                    DxIntegrationModule,
                                    DxTemplateModule
                                ],
                                declarations: [
                                    DxFileManagerComponent
                                ],
                                exports: [
                                    DxFileManagerComponent,
                                    DxoContextMenuModule,
                                    DxiItemModule,
                                    DxoItemViewModule,
                                    DxoDetailsModule,
                                    DxiColumnModule,
                                    DxoNotificationsModule,
                                    DxoPermissionsModule,
                                    DxoToolbarModule,
                                    DxiFileSelectionItemModule,
                                    DxoUploadModule,
                                    DxTemplateModule
                                ]
                            }]
                    }] });

        })
    };
}));
