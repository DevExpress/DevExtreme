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
    SimpleChanges,
    ContentChildren,
    QueryList
} from '@angular/core';


import { Store } from 'devextreme/data';
import DataSource, { Options as DataSourceOptions } from 'devextreme/data/data_source';
import { ChatError, DisposingEvent, InitializedEvent, Message, MessageSendEvent, OptionChangedEvent, User } from 'devextreme/ui/chat';

import DxChat from 'devextreme/ui/chat';


import {
    DxComponent,
    DxTemplateHost,
    DxIntegrationModule,
    DxTemplateModule,
    NestedOptionHost,
    IterableDifferHelper,
    WatcherHelper
} from 'devextreme-angular/core';

import { DxiErrorModule } from 'devextreme-angular/ui/nested';
import { DxiItemModule } from 'devextreme-angular/ui/nested';
import { DxoAuthorModule } from 'devextreme-angular/ui/nested';
import { DxoUserModule } from 'devextreme-angular/ui/nested';

import { DxiChatErrorModule } from 'devextreme-angular/ui/chat/nested';
import { DxiChatItemModule } from 'devextreme-angular/ui/chat/nested';
import { DxoChatAuthorModule } from 'devextreme-angular/ui/chat/nested';
import { DxoChatUserModule } from 'devextreme-angular/ui/chat/nested';

import { DxiErrorComponent } from 'devextreme-angular/ui/nested';
import { DxiItemComponent } from 'devextreme-angular/ui/nested';

import { DxiChatErrorComponent } from 'devextreme-angular/ui/chat/nested';
import { DxiChatItemComponent } from 'devextreme-angular/ui/chat/nested';


/**
 * [descr:dxChat]

 */
@Component({
    selector: 'dx-chat',
    template: '',
    providers: [
        DxTemplateHost,
        WatcherHelper,
        NestedOptionHost,
        IterableDifferHelper
    ]
})
export class DxChatComponent extends DxComponent implements OnDestroy, OnChanges, DoCheck {
    instance: DxChat = null;

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
     * [descr:dxChatOptions.activeStateEnabled]
    
     */
    @Input()
    get activeStateEnabled(): boolean {
        return this._getOption('activeStateEnabled');
    }
    set activeStateEnabled(value: boolean) {
        this._setOption('activeStateEnabled', value);
    }


    /**
     * [descr:dxChatOptions.dataSource]
    
     */
    @Input()
    get dataSource(): Store | DataSource | DataSourceOptions | null | string | Array<Message> {
        return this._getOption('dataSource');
    }
    set dataSource(value: Store | DataSource | DataSourceOptions | null | string | Array<Message>) {
        this._setOption('dataSource', value);
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
     * [descr:dxChatOptions.errors]
    
     */
    @Input()
    get errors(): Array<ChatError> {
        return this._getOption('errors');
    }
    set errors(value: Array<ChatError>) {
        this._setOption('errors', value);
    }


    /**
     * [descr:dxChatOptions.focusStateEnabled]
    
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
     * [descr:dxChatOptions.hoverStateEnabled]
    
     */
    @Input()
    get hoverStateEnabled(): boolean {
        return this._getOption('hoverStateEnabled');
    }
    set hoverStateEnabled(value: boolean) {
        this._setOption('hoverStateEnabled', value);
    }


    /**
     * [descr:dxChatOptions.items]
    
     */
    @Input()
    get items(): Array<Message> {
        return this._getOption('items');
    }
    set items(value: Array<Message>) {
        this._setOption('items', value);
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
     * [descr:dxChatOptions.showDayHeaders]
    
     */
    @Input()
    get showDayHeaders(): boolean {
        return this._getOption('showDayHeaders');
    }
    set showDayHeaders(value: boolean) {
        this._setOption('showDayHeaders', value);
    }


    /**
     * [descr:dxChatOptions.user]
    
     */
    @Input()
    get user(): User {
        return this._getOption('user');
    }
    set user(value: User) {
        this._setOption('user', value);
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
    
     * [descr:dxChatOptions.onDisposing]
    
    
     */
    @Output() onDisposing: EventEmitter<DisposingEvent>;

    /**
    
     * [descr:dxChatOptions.onInitialized]
    
    
     */
    @Output() onInitialized: EventEmitter<InitializedEvent>;

    /**
    
     * [descr:dxChatOptions.onMessageSend]
    
    
     */
    @Output() onMessageSend: EventEmitter<MessageSendEvent>;

    /**
    
     * [descr:dxChatOptions.onOptionChanged]
    
    
     */
    @Output() onOptionChanged: EventEmitter<OptionChangedEvent>;

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
    @Output() dataSourceChange: EventEmitter<Store | DataSource | DataSourceOptions | null | string | Array<Message>>;

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
    @Output() errorsChange: EventEmitter<Array<ChatError>>;

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
    @Output() itemsChange: EventEmitter<Array<Message>>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() rtlEnabledChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() showDayHeadersChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() userChange: EventEmitter<User>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() visibleChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() widthChange: EventEmitter<number | Function | string | undefined>;




    @ContentChildren(DxiChatErrorComponent)
    get errorsChildren(): QueryList<DxiChatErrorComponent> {
        return this._getOption('errors');
    }
    set errorsChildren(value) {
        this.setContentChildren('errors', value, 'DxiChatErrorComponent');
        this.setChildren('errors', value);
    }

    @ContentChildren(DxiChatItemComponent)
    get itemsChildren(): QueryList<DxiChatItemComponent> {
        return this._getOption('items');
    }
    set itemsChildren(value) {
        this.setContentChildren('items', value, 'DxiChatItemComponent');
        this.setChildren('items', value);
    }


    @ContentChildren(DxiErrorComponent)
    get errorsLegacyChildren(): QueryList<DxiErrorComponent> {
        return this._getOption('errors');
    }
    set errorsLegacyChildren(value) {
        if (this.checkContentChildren('errors', value, 'DxiErrorComponent')) {
           this.setChildren('errors', value);
        }
    }

    @ContentChildren(DxiItemComponent)
    get itemsLegacyChildren(): QueryList<DxiItemComponent> {
        return this._getOption('items');
    }
    set itemsLegacyChildren(value) {
        if (this.checkContentChildren('items', value, 'DxiItemComponent')) {
           this.setChildren('items', value);
        }
    }




    constructor(elementRef: ElementRef, ngZone: NgZone, templateHost: DxTemplateHost,
            private _watcherHelper: WatcherHelper,
            private _idh: IterableDifferHelper,
            optionHost: NestedOptionHost,
            transferState: TransferState,
            @Inject(PLATFORM_ID) platformId: any) {

        super(elementRef, ngZone, templateHost, _watcherHelper, transferState, platformId);

        this._createEventEmitters([
            { subscribe: 'disposing', emit: 'onDisposing' },
            { subscribe: 'initialized', emit: 'onInitialized' },
            { subscribe: 'messageSend', emit: 'onMessageSend' },
            { subscribe: 'optionChanged', emit: 'onOptionChanged' },
            { emit: 'accessKeyChange' },
            { emit: 'activeStateEnabledChange' },
            { emit: 'dataSourceChange' },
            { emit: 'disabledChange' },
            { emit: 'elementAttrChange' },
            { emit: 'errorsChange' },
            { emit: 'focusStateEnabledChange' },
            { emit: 'heightChange' },
            { emit: 'hintChange' },
            { emit: 'hoverStateEnabledChange' },
            { emit: 'itemsChange' },
            { emit: 'rtlEnabledChange' },
            { emit: 'showDayHeadersChange' },
            { emit: 'userChange' },
            { emit: 'visibleChange' },
            { emit: 'widthChange' }
        ]);

        this._idh.setHost(this);
        optionHost.setHost(this);
    }

    protected _createInstance(element, options) {

        return new DxChat(element, options);
    }


    ngOnDestroy() {
        this._destroyWidget();
    }

    ngOnChanges(changes: SimpleChanges) {
        super.ngOnChanges(changes);
        this.setupChanges('dataSource', changes);
        this.setupChanges('errors', changes);
        this.setupChanges('items', changes);
    }

    setupChanges(prop: string, changes: SimpleChanges) {
        if (!(prop in this._optionsToUpdate)) {
            this._idh.setup(prop, changes);
        }
    }

    ngDoCheck() {
        this._idh.doCheck('dataSource');
        this._idh.doCheck('errors');
        this._idh.doCheck('items');
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
    DxiErrorModule,
    DxiItemModule,
    DxoAuthorModule,
    DxoUserModule,
    DxiChatErrorModule,
    DxiChatItemModule,
    DxoChatAuthorModule,
    DxoChatUserModule,
    DxIntegrationModule,
    DxTemplateModule
  ],
  declarations: [
    DxChatComponent
  ],
  exports: [
    DxChatComponent,
    DxiErrorModule,
    DxiItemModule,
    DxoAuthorModule,
    DxoUserModule,
    DxiChatErrorModule,
    DxiChatItemModule,
    DxoChatAuthorModule,
    DxoChatUserModule,
    DxTemplateModule
  ]
})
export class DxChatModule { }

import type * as DxChatTypes from "devextreme/ui/chat_types";
export { DxChatTypes };


