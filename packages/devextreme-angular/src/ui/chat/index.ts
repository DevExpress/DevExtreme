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


import DataSource from 'devextreme/data/data_source';
import { Alert, Message, DisposingEvent, InitializedEvent, MessageEnteredEvent, OptionChangedEvent, TypingEndEvent, TypingStartEvent, User } from 'devextreme/ui/chat';
import { DataSourceOptions } from 'devextreme/data/data_source';
import { Store } from 'devextreme/data/store';
import { Format } from 'devextreme/common/core/localization';

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

import { DxiAlertModule } from 'devextreme-angular/ui/nested';
import { DxoDayHeaderFormatModule } from 'devextreme-angular/ui/nested';
import { DxiItemModule } from 'devextreme-angular/ui/nested';
import { DxoAuthorModule } from 'devextreme-angular/ui/nested';
import { DxoMessageTimestampFormatModule } from 'devextreme-angular/ui/nested';
import { DxiTypingUserModule } from 'devextreme-angular/ui/nested';
import { DxoUserModule } from 'devextreme-angular/ui/nested';

import { DxiChatAlertModule } from 'devextreme-angular/ui/chat/nested';
import { DxoChatAuthorModule } from 'devextreme-angular/ui/chat/nested';
import { DxoChatDayHeaderFormatModule } from 'devextreme-angular/ui/chat/nested';
import { DxiChatItemModule } from 'devextreme-angular/ui/chat/nested';
import { DxoChatMessageTimestampFormatModule } from 'devextreme-angular/ui/chat/nested';
import { DxiChatTypingUserModule } from 'devextreme-angular/ui/chat/nested';
import { DxoChatUserModule } from 'devextreme-angular/ui/chat/nested';

import { DxiAlertComponent } from 'devextreme-angular/ui/nested';
import { DxiItemComponent } from 'devextreme-angular/ui/nested';
import { DxiTypingUserComponent } from 'devextreme-angular/ui/nested';

import { DxiChatAlertComponent } from 'devextreme-angular/ui/chat/nested';
import { DxiChatItemComponent } from 'devextreme-angular/ui/chat/nested';
import { DxiChatTypingUserComponent } from 'devextreme-angular/ui/chat/nested';


/**
 * [descr:dxChat]

 */
@Component({
    selector: 'dx-chat',
    template: '',
    host: { ngSkipHydration: 'true' },
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
     * [descr:dxChatOptions.alerts]
    
     */
    @Input()
    get alerts(): Array<Alert> {
        return this._getOption('alerts');
    }
    set alerts(value: Array<Alert>) {
        this._setOption('alerts', value);
    }


    /**
     * [descr:dxChatOptions.dataSource]
    
     */
    @Input()
    get dataSource(): Array<Message> | DataSource | DataSourceOptions | null | Store | string {
        return this._getOption('dataSource');
    }
    set dataSource(value: Array<Message> | DataSource | DataSourceOptions | null | Store | string) {
        this._setOption('dataSource', value);
    }


    /**
     * [descr:dxChatOptions.dayHeaderFormat]
    
     */
    @Input()
    get dayHeaderFormat(): Format {
        return this._getOption('dayHeaderFormat');
    }
    set dayHeaderFormat(value: Format) {
        this._setOption('dayHeaderFormat', value);
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
    get elementAttr(): Record<string, any> {
        return this._getOption('elementAttr');
    }
    set elementAttr(value: Record<string, any>) {
        this._setOption('elementAttr', value);
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
    get height(): (() => number | string) | number | string | undefined {
        return this._getOption('height');
    }
    set height(value: (() => number | string) | number | string | undefined) {
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
     * [descr:dxChatOptions.messageTemplate]
    
     */
    @Input()
    get messageTemplate(): any {
        return this._getOption('messageTemplate');
    }
    set messageTemplate(value: any) {
        this._setOption('messageTemplate', value);
    }


    /**
     * [descr:dxChatOptions.messageTimestampFormat]
    
     */
    @Input()
    get messageTimestampFormat(): Format {
        return this._getOption('messageTimestampFormat');
    }
    set messageTimestampFormat(value: Format) {
        this._setOption('messageTimestampFormat', value);
    }


    /**
     * [descr:dxChatOptions.reloadOnChange]
    
     */
    @Input()
    get reloadOnChange(): boolean {
        return this._getOption('reloadOnChange');
    }
    set reloadOnChange(value: boolean) {
        this._setOption('reloadOnChange', value);
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
     * [descr:dxChatOptions.showAvatar]
    
     */
    @Input()
    get showAvatar(): boolean {
        return this._getOption('showAvatar');
    }
    set showAvatar(value: boolean) {
        this._setOption('showAvatar', value);
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
     * [descr:dxChatOptions.showMessageTimestamp]
    
     */
    @Input()
    get showMessageTimestamp(): boolean {
        return this._getOption('showMessageTimestamp');
    }
    set showMessageTimestamp(value: boolean) {
        this._setOption('showMessageTimestamp', value);
    }


    /**
     * [descr:dxChatOptions.showUserName]
    
     */
    @Input()
    get showUserName(): boolean {
        return this._getOption('showUserName');
    }
    set showUserName(value: boolean) {
        this._setOption('showUserName', value);
    }


    /**
     * [descr:dxChatOptions.typingUsers]
    
     */
    @Input()
    get typingUsers(): Array<User> {
        return this._getOption('typingUsers');
    }
    set typingUsers(value: Array<User>) {
        this._setOption('typingUsers', value);
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
    get width(): (() => number | string) | number | string | undefined {
        return this._getOption('width');
    }
    set width(value: (() => number | string) | number | string | undefined) {
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
    
     * [descr:dxChatOptions.onMessageEntered]
    
    
     */
    @Output() onMessageEntered: EventEmitter<MessageEnteredEvent>;

    /**
    
     * [descr:dxChatOptions.onOptionChanged]
    
    
     */
    @Output() onOptionChanged: EventEmitter<OptionChangedEvent>;

    /**
    
     * [descr:dxChatOptions.onTypingEnd]
    
    
     */
    @Output() onTypingEnd: EventEmitter<TypingEndEvent>;

    /**
    
     * [descr:dxChatOptions.onTypingStart]
    
    
     */
    @Output() onTypingStart: EventEmitter<TypingStartEvent>;

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
    @Output() alertsChange: EventEmitter<Array<Alert>>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() dataSourceChange: EventEmitter<Array<Message> | DataSource | DataSourceOptions | null | Store | string>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() dayHeaderFormatChange: EventEmitter<Format>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() disabledChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() elementAttrChange: EventEmitter<Record<string, any>>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() focusStateEnabledChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() heightChange: EventEmitter<(() => number | string) | number | string | undefined>;

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
    @Output() messageTemplateChange: EventEmitter<any>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() messageTimestampFormatChange: EventEmitter<Format>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() reloadOnChangeChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() rtlEnabledChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() showAvatarChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() showDayHeadersChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() showMessageTimestampChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() showUserNameChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() typingUsersChange: EventEmitter<Array<User>>;

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
    @Output() widthChange: EventEmitter<(() => number | string) | number | string | undefined>;




    @ContentChildren(DxiChatAlertComponent)
    get alertsChildren(): QueryList<DxiChatAlertComponent> {
        return this._getOption('alerts');
    }
    set alertsChildren(value) {
        this._setChildren('alerts', value, 'DxiChatAlertComponent');
    }

    @ContentChildren(DxiChatItemComponent)
    get itemsChildren(): QueryList<DxiChatItemComponent> {
        return this._getOption('items');
    }
    set itemsChildren(value) {
        this._setChildren('items', value, 'DxiChatItemComponent');
    }

    @ContentChildren(DxiChatTypingUserComponent)
    get typingUsersChildren(): QueryList<DxiChatTypingUserComponent> {
        return this._getOption('typingUsers');
    }
    set typingUsersChildren(value) {
        this._setChildren('typingUsers', value, 'DxiChatTypingUserComponent');
    }


    @ContentChildren(DxiAlertComponent)
    get alertsLegacyChildren(): QueryList<DxiAlertComponent> {
        return this._getOption('alerts');
    }
    set alertsLegacyChildren(value) {
        this._setChildren('alerts', value, 'DxiAlertComponent');
    }

    @ContentChildren(DxiItemComponent)
    get itemsLegacyChildren(): QueryList<DxiItemComponent> {
        return this._getOption('items');
    }
    set itemsLegacyChildren(value) {
        this._setChildren('items', value, 'DxiItemComponent');
    }

    @ContentChildren(DxiTypingUserComponent)
    get typingUsersLegacyChildren(): QueryList<DxiTypingUserComponent> {
        return this._getOption('typingUsers');
    }
    set typingUsersLegacyChildren(value) {
        this._setChildren('typingUsers', value, 'DxiTypingUserComponent');
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
            { subscribe: 'messageEntered', emit: 'onMessageEntered' },
            { subscribe: 'optionChanged', emit: 'onOptionChanged' },
            { subscribe: 'typingEnd', emit: 'onTypingEnd' },
            { subscribe: 'typingStart', emit: 'onTypingStart' },
            { emit: 'accessKeyChange' },
            { emit: 'activeStateEnabledChange' },
            { emit: 'alertsChange' },
            { emit: 'dataSourceChange' },
            { emit: 'dayHeaderFormatChange' },
            { emit: 'disabledChange' },
            { emit: 'elementAttrChange' },
            { emit: 'focusStateEnabledChange' },
            { emit: 'heightChange' },
            { emit: 'hintChange' },
            { emit: 'hoverStateEnabledChange' },
            { emit: 'itemsChange' },
            { emit: 'messageTemplateChange' },
            { emit: 'messageTimestampFormatChange' },
            { emit: 'reloadOnChangeChange' },
            { emit: 'rtlEnabledChange' },
            { emit: 'showAvatarChange' },
            { emit: 'showDayHeadersChange' },
            { emit: 'showMessageTimestampChange' },
            { emit: 'showUserNameChange' },
            { emit: 'typingUsersChange' },
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
        this.setupChanges('alerts', changes);
        this.setupChanges('dataSource', changes);
        this.setupChanges('items', changes);
        this.setupChanges('typingUsers', changes);
    }

    setupChanges(prop: string, changes: SimpleChanges) {
        if (!(prop in this._optionsToUpdate)) {
            this._idh.setup(prop, changes);
        }
    }

    ngDoCheck() {
        this._idh.doCheck('alerts');
        this._idh.doCheck('dataSource');
        this._idh.doCheck('items');
        this._idh.doCheck('typingUsers');
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
    DxiAlertModule,
    DxoDayHeaderFormatModule,
    DxiItemModule,
    DxoAuthorModule,
    DxoMessageTimestampFormatModule,
    DxiTypingUserModule,
    DxoUserModule,
    DxiChatAlertModule,
    DxoChatAuthorModule,
    DxoChatDayHeaderFormatModule,
    DxiChatItemModule,
    DxoChatMessageTimestampFormatModule,
    DxiChatTypingUserModule,
    DxoChatUserModule,
    DxIntegrationModule,
    DxTemplateModule
  ],
  declarations: [
    DxChatComponent
  ],
  exports: [
    DxChatComponent,
    DxiAlertModule,
    DxoDayHeaderFormatModule,
    DxiItemModule,
    DxoAuthorModule,
    DxoMessageTimestampFormatModule,
    DxiTypingUserModule,
    DxoUserModule,
    DxiChatAlertModule,
    DxoChatAuthorModule,
    DxoChatDayHeaderFormatModule,
    DxiChatItemModule,
    DxoChatMessageTimestampFormatModule,
    DxiChatTypingUserModule,
    DxoChatUserModule,
    DxTemplateModule
  ]
})
export class DxChatModule { }

import type * as DxChatTypes from "devextreme/ui/chat_types";
export { DxChatTypes };


