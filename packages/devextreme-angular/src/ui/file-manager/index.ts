/* tslint:disable:max-line-length */


import {
    TransferState,
    Component,
    NgModule,
    ElementRef,
    NgZone,
    PLATFORM_ID,
    Inject,

    Input,
    Output,
    OnDestroy,
    EventEmitter,
    OnChanges,
    DoCheck,
    SimpleChanges
} from '@angular/core';


import { SingleOrMultiple } from 'devextreme/common';
import { ContentReadyEvent, ContextMenuItemClickEvent, ContextMenuShowingEvent, CurrentDirectoryChangedEvent, DirectoryCreatedEvent, DirectoryCreatingEvent, DisposingEvent, dxFileManagerContextMenu, dxFileManagerDetailsColumn, dxFileManagerToolbar, ErrorOccurredEvent, FileManagerItemViewMode, FileUploadedEvent, FileUploadingEvent, FocusedItemChangedEvent, InitializedEvent, ItemCopiedEvent, ItemCopyingEvent, ItemDeletedEvent, ItemDeletingEvent, ItemDownloadingEvent, ItemMovedEvent, ItemMovingEvent, ItemRenamedEvent, ItemRenamingEvent, OptionChangedEvent, SelectedFileOpenedEvent, SelectionChangedEvent, ToolbarItemClickEvent } from 'devextreme/ui/file_manager';

import DxFileManager from 'devextreme/ui/file_manager';


import {
    DxComponent,
    DxTemplateHost,
    DxIntegrationModule,
    DxTemplateModule,
    NestedOptionHost,
    IterableDifferHelper,
    WatcherHelper
} from 'devextreme-angular/core';

import { DxoContextMenuModule } from 'devextreme-angular/ui/nested';
import { DxiItemModule } from 'devextreme-angular/ui/nested';
import { DxoItemViewModule } from 'devextreme-angular/ui/nested';
import { DxoDetailsModule } from 'devextreme-angular/ui/nested';
import { DxiColumnModule } from 'devextreme-angular/ui/nested';
import { DxoNotificationsModule } from 'devextreme-angular/ui/nested';
import { DxoPermissionsModule } from 'devextreme-angular/ui/nested';
import { DxoToolbarModule } from 'devextreme-angular/ui/nested';
import { DxiFileSelectionItemModule } from 'devextreme-angular/ui/nested';
import { DxoUploadModule } from 'devextreme-angular/ui/nested';




/**
 * [descr:dxFileManager]

 */
@Component({
    selector: 'dx-file-manager',
    template: '',
    providers: [
        DxTemplateHost,
        WatcherHelper,
        NestedOptionHost,
        IterableDifferHelper
    ]
})
export class DxFileManagerComponent extends DxComponent implements OnDestroy, OnChanges, DoCheck {
    instance: DxFileManager = null;

    /**
     * [descr:WidgetOptions.accessKey]
    
     */
    @Input()
    get accessKey(): string | undefined {
        return this._getOption('accessKey');
    }
    set accessKey(value: string | undefined) {
        this._setOption('accessKey', value);
    }


    /**
     * [descr:WidgetOptions.activeStateEnabled]
    
     */
    @Input()
    get activeStateEnabled(): boolean {
        return this._getOption('activeStateEnabled');
    }
    set activeStateEnabled(value: boolean) {
        this._setOption('activeStateEnabled', value);
    }


    /**
     * [descr:dxFileManagerOptions.allowedFileExtensions]
    
     */
    @Input()
    get allowedFileExtensions(): Array<string> {
        return this._getOption('allowedFileExtensions');
    }
    set allowedFileExtensions(value: Array<string>) {
        this._setOption('allowedFileExtensions', value);
    }


    /**
     * [descr:dxFileManagerOptions.contextMenu]
    
     */
    @Input()
    get contextMenu(): dxFileManagerContextMenu {
        return this._getOption('contextMenu');
    }
    set contextMenu(value: dxFileManagerContextMenu) {
        this._setOption('contextMenu', value);
    }


    /**
     * [descr:dxFileManagerOptions.currentPath]
    
     */
    @Input()
    get currentPath(): string {
        return this._getOption('currentPath');
    }
    set currentPath(value: string) {
        this._setOption('currentPath', value);
    }


    /**
     * [descr:dxFileManagerOptions.currentPathKeys]
    
     */
    @Input()
    get currentPathKeys(): Array<string> {
        return this._getOption('currentPathKeys');
    }
    set currentPathKeys(value: Array<string>) {
        this._setOption('currentPathKeys', value);
    }


    /**
     * [descr:dxFileManagerOptions.customizeDetailColumns]
    
     */
    @Input()
    get customizeDetailColumns(): Function {
        return this._getOption('customizeDetailColumns');
    }
    set customizeDetailColumns(value: Function) {
        this._setOption('customizeDetailColumns', value);
    }


    /**
     * [descr:dxFileManagerOptions.customizeThumbnail]
    
     */
    @Input()
    get customizeThumbnail(): Function {
        return this._getOption('customizeThumbnail');
    }
    set customizeThumbnail(value: Function) {
        this._setOption('customizeThumbnail', value);
    }


    /**
     * [descr:WidgetOptions.disabled]
    
     */
    @Input()
    get disabled(): boolean {
        return this._getOption('disabled');
    }
    set disabled(value: boolean) {
        this._setOption('disabled', value);
    }


    /**
     * [descr:DOMComponentOptions.elementAttr]
    
     */
    @Input()
    get elementAttr(): any {
        return this._getOption('elementAttr');
    }
    set elementAttr(value: any) {
        this._setOption('elementAttr', value);
    }


    /**
     * [descr:dxFileManagerOptions.fileSystemProvider]
    
     */
    @Input()
    get fileSystemProvider(): any {
        return this._getOption('fileSystemProvider');
    }
    set fileSystemProvider(value: any) {
        this._setOption('fileSystemProvider', value);
    }


    /**
     * [descr:dxFileManagerOptions.focusedItemKey]
    
     */
    @Input()
    get focusedItemKey(): string {
        return this._getOption('focusedItemKey');
    }
    set focusedItemKey(value: string) {
        this._setOption('focusedItemKey', value);
    }


    /**
     * [descr:WidgetOptions.focusStateEnabled]
    
     */
    @Input()
    get focusStateEnabled(): boolean {
        return this._getOption('focusStateEnabled');
    }
    set focusStateEnabled(value: boolean) {
        this._setOption('focusStateEnabled', value);
    }


    /**
     * [descr:DOMComponentOptions.height]
    
     */
    @Input()
    get height(): number | Function | string | undefined {
        return this._getOption('height');
    }
    set height(value: number | Function | string | undefined) {
        this._setOption('height', value);
    }


    /**
     * [descr:WidgetOptions.hint]
    
     */
    @Input()
    get hint(): string | undefined {
        return this._getOption('hint');
    }
    set hint(value: string | undefined) {
        this._setOption('hint', value);
    }


    /**
     * [descr:WidgetOptions.hoverStateEnabled]
    
     */
    @Input()
    get hoverStateEnabled(): boolean {
        return this._getOption('hoverStateEnabled');
    }
    set hoverStateEnabled(value: boolean) {
        this._setOption('hoverStateEnabled', value);
    }


    /**
     * [descr:dxFileManagerOptions.itemView]
    
     */
    @Input()
    get itemView(): { details?: { columns?: Array<dxFileManagerDetailsColumn | string> }, mode?: FileManagerItemViewMode, showFolders?: boolean, showParentFolder?: boolean } {
        return this._getOption('itemView');
    }
    set itemView(value: { details?: { columns?: Array<dxFileManagerDetailsColumn | string> }, mode?: FileManagerItemViewMode, showFolders?: boolean, showParentFolder?: boolean }) {
        this._setOption('itemView', value);
    }


    /**
     * [descr:dxFileManagerOptions.notifications]
    
     */
    @Input()
    get notifications(): { showPanel?: boolean, showPopup?: boolean } {
        return this._getOption('notifications');
    }
    set notifications(value: { showPanel?: boolean, showPopup?: boolean }) {
        this._setOption('notifications', value);
    }


    /**
     * [descr:dxFileManagerOptions.permissions]
    
     */
    @Input()
    get permissions(): { copy?: boolean, create?: boolean, delete?: boolean, download?: boolean, move?: boolean, rename?: boolean, upload?: boolean } {
        return this._getOption('permissions');
    }
    set permissions(value: { copy?: boolean, create?: boolean, delete?: boolean, download?: boolean, move?: boolean, rename?: boolean, upload?: boolean }) {
        this._setOption('permissions', value);
    }


    /**
     * [descr:dxFileManagerOptions.rootFolderName]
    
     */
    @Input()
    get rootFolderName(): string {
        return this._getOption('rootFolderName');
    }
    set rootFolderName(value: string) {
        this._setOption('rootFolderName', value);
    }


    /**
     * [descr:DOMComponentOptions.rtlEnabled]
    
     */
    @Input()
    get rtlEnabled(): boolean {
        return this._getOption('rtlEnabled');
    }
    set rtlEnabled(value: boolean) {
        this._setOption('rtlEnabled', value);
    }


    /**
     * [descr:dxFileManagerOptions.selectedItemKeys]
    
     */
    @Input()
    get selectedItemKeys(): Array<string> {
        return this._getOption('selectedItemKeys');
    }
    set selectedItemKeys(value: Array<string>) {
        this._setOption('selectedItemKeys', value);
    }


    /**
     * [descr:dxFileManagerOptions.selectionMode]
    
     */
    @Input()
    get selectionMode(): SingleOrMultiple {
        return this._getOption('selectionMode');
    }
    set selectionMode(value: SingleOrMultiple) {
        this._setOption('selectionMode', value);
    }


    /**
     * [descr:WidgetOptions.tabIndex]
    
     */
    @Input()
    get tabIndex(): number {
        return this._getOption('tabIndex');
    }
    set tabIndex(value: number) {
        this._setOption('tabIndex', value);
    }


    /**
     * [descr:dxFileManagerOptions.toolbar]
    
     */
    @Input()
    get toolbar(): dxFileManagerToolbar {
        return this._getOption('toolbar');
    }
    set toolbar(value: dxFileManagerToolbar) {
        this._setOption('toolbar', value);
    }


    /**
     * [descr:dxFileManagerOptions.upload]
    
     */
    @Input()
    get upload(): { chunkSize?: number, maxFileSize?: number } {
        return this._getOption('upload');
    }
    set upload(value: { chunkSize?: number, maxFileSize?: number }) {
        this._setOption('upload', value);
    }


    /**
     * [descr:WidgetOptions.visible]
    
     */
    @Input()
    get visible(): boolean {
        return this._getOption('visible');
    }
    set visible(value: boolean) {
        this._setOption('visible', value);
    }


    /**
     * [descr:DOMComponentOptions.width]
    
     */
    @Input()
    get width(): number | Function | string | undefined {
        return this._getOption('width');
    }
    set width(value: number | Function | string | undefined) {
        this._setOption('width', value);
    }

    /**
    
     * [descr:dxFileManagerOptions.onContentReady]
    
    
     */
    @Output() onContentReady: EventEmitter<ContentReadyEvent>;

    /**
    
     * [descr:dxFileManagerOptions.onContextMenuItemClick]
    
    
     */
    @Output() onContextMenuItemClick: EventEmitter<ContextMenuItemClickEvent>;

    /**
    
     * [descr:dxFileManagerOptions.onContextMenuShowing]
    
    
     */
    @Output() onContextMenuShowing: EventEmitter<ContextMenuShowingEvent>;

    /**
    
     * [descr:dxFileManagerOptions.onCurrentDirectoryChanged]
    
    
     */
    @Output() onCurrentDirectoryChanged: EventEmitter<CurrentDirectoryChangedEvent>;

    /**
    
     * [descr:dxFileManagerOptions.onDirectoryCreated]
    
    
     */
    @Output() onDirectoryCreated: EventEmitter<DirectoryCreatedEvent>;

    /**
    
     * [descr:dxFileManagerOptions.onDirectoryCreating]
    
    
     */
    @Output() onDirectoryCreating: EventEmitter<DirectoryCreatingEvent>;

    /**
    
     * [descr:dxFileManagerOptions.onDisposing]
    
    
     */
    @Output() onDisposing: EventEmitter<DisposingEvent>;

    /**
    
     * [descr:dxFileManagerOptions.onErrorOccurred]
    
    
     */
    @Output() onErrorOccurred: EventEmitter<ErrorOccurredEvent>;

    /**
    
     * [descr:dxFileManagerOptions.onFileUploaded]
    
    
     */
    @Output() onFileUploaded: EventEmitter<FileUploadedEvent>;

    /**
    
     * [descr:dxFileManagerOptions.onFileUploading]
    
    
     */
    @Output() onFileUploading: EventEmitter<FileUploadingEvent>;

    /**
    
     * [descr:dxFileManagerOptions.onFocusedItemChanged]
    
    
     */
    @Output() onFocusedItemChanged: EventEmitter<FocusedItemChangedEvent>;

    /**
    
     * [descr:dxFileManagerOptions.onInitialized]
    
    
     */
    @Output() onInitialized: EventEmitter<InitializedEvent>;

    /**
    
     * [descr:dxFileManagerOptions.onItemCopied]
    
    
     */
    @Output() onItemCopied: EventEmitter<ItemCopiedEvent>;

    /**
    
     * [descr:dxFileManagerOptions.onItemCopying]
    
    
     */
    @Output() onItemCopying: EventEmitter<ItemCopyingEvent>;

    /**
    
     * [descr:dxFileManagerOptions.onItemDeleted]
    
    
     */
    @Output() onItemDeleted: EventEmitter<ItemDeletedEvent>;

    /**
    
     * [descr:dxFileManagerOptions.onItemDeleting]
    
    
     */
    @Output() onItemDeleting: EventEmitter<ItemDeletingEvent>;

    /**
    
     * [descr:dxFileManagerOptions.onItemDownloading]
    
    
     */
    @Output() onItemDownloading: EventEmitter<ItemDownloadingEvent>;

    /**
    
     * [descr:dxFileManagerOptions.onItemMoved]
    
    
     */
    @Output() onItemMoved: EventEmitter<ItemMovedEvent>;

    /**
    
     * [descr:dxFileManagerOptions.onItemMoving]
    
    
     */
    @Output() onItemMoving: EventEmitter<ItemMovingEvent>;

    /**
    
     * [descr:dxFileManagerOptions.onItemRenamed]
    
    
     */
    @Output() onItemRenamed: EventEmitter<ItemRenamedEvent>;

    /**
    
     * [descr:dxFileManagerOptions.onItemRenaming]
    
    
     */
    @Output() onItemRenaming: EventEmitter<ItemRenamingEvent>;

    /**
    
     * [descr:dxFileManagerOptions.onOptionChanged]
    
    
     */
    @Output() onOptionChanged: EventEmitter<OptionChangedEvent>;

    /**
    
     * [descr:dxFileManagerOptions.onSelectedFileOpened]
    
    
     */
    @Output() onSelectedFileOpened: EventEmitter<SelectedFileOpenedEvent>;

    /**
    
     * [descr:dxFileManagerOptions.onSelectionChanged]
    
    
     */
    @Output() onSelectionChanged: EventEmitter<SelectionChangedEvent>;

    /**
    
     * [descr:dxFileManagerOptions.onToolbarItemClick]
    
    
     */
    @Output() onToolbarItemClick: EventEmitter<ToolbarItemClickEvent>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() accessKeyChange: EventEmitter<string | undefined>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() activeStateEnabledChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() allowedFileExtensionsChange: EventEmitter<Array<string>>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() contextMenuChange: EventEmitter<dxFileManagerContextMenu>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() currentPathChange: EventEmitter<string>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() currentPathKeysChange: EventEmitter<Array<string>>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() customizeDetailColumnsChange: EventEmitter<Function>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() customizeThumbnailChange: EventEmitter<Function>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() disabledChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() elementAttrChange: EventEmitter<any>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() fileSystemProviderChange: EventEmitter<any>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() focusedItemKeyChange: EventEmitter<string>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() focusStateEnabledChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() heightChange: EventEmitter<number | Function | string | undefined>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() hintChange: EventEmitter<string | undefined>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() hoverStateEnabledChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() itemViewChange: EventEmitter<{ details?: { columns?: Array<dxFileManagerDetailsColumn | string> }, mode?: FileManagerItemViewMode, showFolders?: boolean, showParentFolder?: boolean }>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() notificationsChange: EventEmitter<{ showPanel?: boolean, showPopup?: boolean }>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() permissionsChange: EventEmitter<{ copy?: boolean, create?: boolean, delete?: boolean, download?: boolean, move?: boolean, rename?: boolean, upload?: boolean }>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() rootFolderNameChange: EventEmitter<string>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() rtlEnabledChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() selectedItemKeysChange: EventEmitter<Array<string>>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() selectionModeChange: EventEmitter<SingleOrMultiple>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() tabIndexChange: EventEmitter<number>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() toolbarChange: EventEmitter<dxFileManagerToolbar>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() uploadChange: EventEmitter<{ chunkSize?: number, maxFileSize?: number }>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() visibleChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() widthChange: EventEmitter<number | Function | string | undefined>;







    constructor(elementRef: ElementRef, ngZone: NgZone, templateHost: DxTemplateHost,
            private _watcherHelper: WatcherHelper,
            private _idh: IterableDifferHelper,
            optionHost: NestedOptionHost,
            transferState: TransferState,
            @Inject(PLATFORM_ID) platformId: any) {

        super(elementRef, ngZone, templateHost, _watcherHelper, transferState, platformId);

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

    protected _createInstance(element, options) {

        return new DxFileManager(element, options);
    }


    ngOnDestroy() {
        this._destroyWidget();
    }

    ngOnChanges(changes: SimpleChanges) {
        super.ngOnChanges(changes);
        this.setupChanges('allowedFileExtensions', changes);
        this.setupChanges('currentPathKeys', changes);
        this.setupChanges('selectedItemKeys', changes);
    }

    setupChanges(prop: string, changes: SimpleChanges) {
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

    _setOption(name: string, value: any) {
        let isSetup = this._idh.setupSingle(name, value);
        let isChanged = this._idh.getChanges(name, value) !== null;

        if (isSetup || isChanged) {
            super._setOption(name, value);
        }
    }
}

@NgModule({
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
})
export class DxFileManagerModule { }

import type * as DxFileManagerTypes from "devextreme/ui/file_manager_types";
export { DxFileManagerTypes };


