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


import type { default as dxChat, Alert, Message, AttachmentDownloadClickEvent, DisposingEvent, InitializedEvent, InputFieldTextChangedEvent, MessageDeletedEvent, MessageDeletingEvent, MessageEditCanceledEvent, MessageEditingStartEvent, MessageEnteredEvent, MessageUpdatedEvent, MessageUpdatingEvent, OptionChangedEvent, TypingEndEvent, TypingStartEvent, SendButtonProperties, User } from 'devextreme/ui/chat';
import type { default as DataSource, DataSourceOptions } from 'devextreme/data/data_source';
import type { Store } from 'devextreme/data/store';
import type { Format } from 'devextreme/common/core/localization';
import type { dxFileUploaderOptions } from 'devextreme/ui/file_uploader';
import type { dxSpeechToTextOptions } from 'devextreme/ui/speech_to_text';
import type { dxButtonGroupOptions } from 'devextreme/ui/button_group';

import DxChat from 'devextreme/ui/chat';


import {
    DxComponent,
    DxTemplateHost,
    DxIntegrationModule,
    DxTemplateModule,
    NestedOptionHost,
    IterableDifferHelper,
    WatcherHelper,
    CollectionNestedOption,
} from 'devextreme-angular/core';

import { DxiAlertModule } from 'devextreme-angular/ui/nested';
import { DxoDayHeaderFormatModule } from 'devextreme-angular/ui/nested';
import { DxoEditingModule } from 'devextreme-angular/ui/nested';
import { DxiItemModule } from 'devextreme-angular/ui/nested';
import { DxoAuthorModule } from 'devextreme-angular/ui/nested';
import { DxoMessageTimestampFormatModule } from 'devextreme-angular/ui/nested';
import { DxiTypingUserModule } from 'devextreme-angular/ui/nested';
import { DxoUserModule } from 'devextreme-angular/ui/nested';

import { DxiChatAlertModule } from 'devextreme-angular/ui/chat/nested';
import { DxiChatAttachmentModule } from 'devextreme-angular/ui/chat/nested';
import { DxoChatAuthorModule } from 'devextreme-angular/ui/chat/nested';
import { DxiChatChatItemModule } from 'devextreme-angular/ui/chat/nested';
import { DxoChatCustomSpeechRecognizerModule } from 'devextreme-angular/ui/chat/nested';
import { DxoChatDayHeaderFormatModule } from 'devextreme-angular/ui/chat/nested';
import { DxoChatEditingModule } from 'devextreme-angular/ui/chat/nested';
import { DxoChatFileUploaderOptionsModule } from 'devextreme-angular/ui/chat/nested';
import { DxiChatItemModule } from 'devextreme-angular/ui/chat/nested';
import { DxoChatMessageTimestampFormatModule } from 'devextreme-angular/ui/chat/nested';
import { DxoChatSendButtonOptionsModule } from 'devextreme-angular/ui/chat/nested';
import { DxoChatSpeechRecognitionConfigModule } from 'devextreme-angular/ui/chat/nested';
import { DxoChatSpeechToTextOptionsModule } from 'devextreme-angular/ui/chat/nested';
import { DxoChatSuggestionsModule } from 'devextreme-angular/ui/chat/nested';
import { DxiChatSuggestionsItemModule } from 'devextreme-angular/ui/chat/nested';
import { DxiChatTypingUserModule } from 'devextreme-angular/ui/chat/nested';
import { DxoChatUserModule } from 'devextreme-angular/ui/chat/nested';
import { 
           PROPERTY_TOKEN_alerts,
           PROPERTY_TOKEN_attachments,
           PROPERTY_TOKEN_items,
           PROPERTY_TOKEN_typingUsers,
     } from 'devextreme-angular/core/tokens';


/**
 * [descr:dxChat]

 */
@Component({
    selector: 'dx-chat',
    template: '',
    host: { ngSkipHydration: 'true' },
    imports: [ DxIntegrationModule ],
    providers: [
        DxTemplateHost,
        WatcherHelper,
        NestedOptionHost,
        IterableDifferHelper
    ]
})
export class DxChatComponent extends DxComponent implements OnDestroy, OnChanges, DoCheck {

    @ContentChildren(PROPERTY_TOKEN_alerts)
    set _alertsContentChildren(value: QueryList<CollectionNestedOption>) {
        this.setChildren('alerts', value);
    }

    @ContentChildren(PROPERTY_TOKEN_attachments)
    set _attachmentsContentChildren(value: QueryList<CollectionNestedOption>) {
        this.setChildren('attachments', value);
    }

    @ContentChildren(PROPERTY_TOKEN_items)
    set _itemsContentChildren(value: QueryList<CollectionNestedOption>) {
        this.setChildren('items', value);
    }

    @ContentChildren(PROPERTY_TOKEN_typingUsers)
    set _typingUsersContentChildren(value: QueryList<CollectionNestedOption>) {
        this.setChildren('typingUsers', value);
    }

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
     * [descr:dxChatOptions.editing]
    
     */
    @Input()
    get editing(): { allowDeleting?: boolean | ((options: { component: dxChat, message: Message }) => boolean), allowUpdating?: boolean | ((options: { component: dxChat, message: Message }) => boolean) } {
        return this._getOption('editing');
    }
    set editing(value: { allowDeleting?: boolean | ((options: { component: dxChat, message: Message }) => boolean), allowUpdating?: boolean | ((options: { component: dxChat, message: Message }) => boolean) }) {
        this._setOption('editing', value);
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
     * [descr:dxChatOptions.emptyViewTemplate]
    
     */
    @Input()
    get emptyViewTemplate(): any {
        return this._getOption('emptyViewTemplate');
    }
    set emptyViewTemplate(value: any) {
        this._setOption('emptyViewTemplate', value);
    }


    
    @Input()
    get fileUploaderOptions(): dxFileUploaderOptions {
        return this._getOption('fileUploaderOptions');
    }
    set fileUploaderOptions(value: dxFileUploaderOptions) {
        this._setOption('fileUploaderOptions', value);
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
    get height(): number | string | undefined {
        return this._getOption('height');
    }
    set height(value: number | string | undefined) {
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


    
    @Input()
    get inputFieldText(): string | undefined {
        return this._getOption('inputFieldText');
    }
    set inputFieldText(value: string | undefined) {
        this._setOption('inputFieldText', value);
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


    
    @Input()
    get sendButtonOptions(): SendButtonProperties {
        return this._getOption('sendButtonOptions');
    }
    set sendButtonOptions(value: SendButtonProperties) {
        this._setOption('sendButtonOptions', value);
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
     * [descr:dxChatOptions.speechToTextEnabled]
    
     */
    @Input()
    get speechToTextEnabled(): boolean {
        return this._getOption('speechToTextEnabled');
    }
    set speechToTextEnabled(value: boolean) {
        this._setOption('speechToTextEnabled', value);
    }


    
    @Input()
    get speechToTextOptions(): dxSpeechToTextOptions {
        return this._getOption('speechToTextOptions');
    }
    set speechToTextOptions(value: dxSpeechToTextOptions) {
        this._setOption('speechToTextOptions', value);
    }


    
    @Input()
    get suggestions(): dxButtonGroupOptions {
        return this._getOption('suggestions');
    }
    set suggestions(value: dxButtonGroupOptions) {
        this._setOption('suggestions', value);
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
    get width(): number | string | undefined {
        return this._getOption('width');
    }
    set width(value: number | string | undefined) {
        this._setOption('width', value);
    }

    /**
    
     * [descr:undefined]
    
    
     */
    @Output() onAttachmentDownloadClick: EventEmitter<AttachmentDownloadClickEvent>;

    /**
    
     * [descr:dxChatOptions.onDisposing]
    
    
     */
    @Output() onDisposing: EventEmitter<DisposingEvent>;

    /**
    
     * [descr:dxChatOptions.onInitialized]
    
    
     */
    @Output() onInitialized: EventEmitter<InitializedEvent>;

    /**
    
     * [descr:dxChatOptions.onInputFieldTextChanged]
    
    
     */
    @Output() onInputFieldTextChanged: EventEmitter<InputFieldTextChangedEvent>;

    /**
    
     * [descr:dxChatOptions.onMessageDeleted]
    
    
     */
    @Output() onMessageDeleted: EventEmitter<MessageDeletedEvent>;

    /**
    
     * [descr:dxChatOptions.onMessageDeleting]
    
    
     */
    @Output() onMessageDeleting: EventEmitter<MessageDeletingEvent>;

    /**
    
     * [descr:dxChatOptions.onMessageEditCanceled]
    
    
     */
    @Output() onMessageEditCanceled: EventEmitter<MessageEditCanceledEvent>;

    /**
    
     * [descr:dxChatOptions.onMessageEditingStart]
    
    
     */
    @Output() onMessageEditingStart: EventEmitter<MessageEditingStartEvent>;

    /**
    
     * [descr:dxChatOptions.onMessageEntered]
    
    
     */
    @Output() onMessageEntered: EventEmitter<MessageEnteredEvent>;

    /**
    
     * [descr:dxChatOptions.onMessageUpdated]
    
    
     */
    @Output() onMessageUpdated: EventEmitter<MessageUpdatedEvent>;

    /**
    
     * [descr:dxChatOptions.onMessageUpdating]
    
    
     */
    @Output() onMessageUpdating: EventEmitter<MessageUpdatingEvent>;

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
    @Output() editingChange: EventEmitter<{ allowDeleting?: boolean | ((options: { component: dxChat, message: Message }) => boolean), allowUpdating?: boolean | ((options: { component: dxChat, message: Message }) => boolean) }>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() elementAttrChange: EventEmitter<Record<string, any>>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() emptyViewTemplateChange: EventEmitter<any>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() fileUploaderOptionsChange: EventEmitter<dxFileUploaderOptions>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() focusStateEnabledChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() heightChange: EventEmitter<number | string | undefined>;

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
    @Output() inputFieldTextChange: EventEmitter<string | undefined>;

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
    @Output() sendButtonOptionsChange: EventEmitter<SendButtonProperties>;

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
    @Output() speechToTextEnabledChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() speechToTextOptionsChange: EventEmitter<dxSpeechToTextOptions>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() suggestionsChange: EventEmitter<dxButtonGroupOptions>;

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
    @Output() widthChange: EventEmitter<number | string | undefined>;




    constructor(elementRef: ElementRef, ngZone: NgZone, templateHost: DxTemplateHost,
            private _watcherHelper: WatcherHelper,
            private _idh: IterableDifferHelper,
            optionHost: NestedOptionHost,
            transferState: TransferState,
            @Inject(PLATFORM_ID) platformId: any) {

        super(elementRef, ngZone, templateHost, _watcherHelper, transferState, platformId);

        this._createEventEmitters([
            { subscribe: 'attachmentDownloadClick', emit: 'onAttachmentDownloadClick' },
            { subscribe: 'disposing', emit: 'onDisposing' },
            { subscribe: 'initialized', emit: 'onInitialized' },
            { subscribe: 'inputFieldTextChanged', emit: 'onInputFieldTextChanged' },
            { subscribe: 'messageDeleted', emit: 'onMessageDeleted' },
            { subscribe: 'messageDeleting', emit: 'onMessageDeleting' },
            { subscribe: 'messageEditCanceled', emit: 'onMessageEditCanceled' },
            { subscribe: 'messageEditingStart', emit: 'onMessageEditingStart' },
            { subscribe: 'messageEntered', emit: 'onMessageEntered' },
            { subscribe: 'messageUpdated', emit: 'onMessageUpdated' },
            { subscribe: 'messageUpdating', emit: 'onMessageUpdating' },
            { subscribe: 'optionChanged', emit: 'onOptionChanged' },
            { subscribe: 'typingEnd', emit: 'onTypingEnd' },
            { subscribe: 'typingStart', emit: 'onTypingStart' },
            { emit: 'accessKeyChange' },
            { emit: 'activeStateEnabledChange' },
            { emit: 'alertsChange' },
            { emit: 'dataSourceChange' },
            { emit: 'dayHeaderFormatChange' },
            { emit: 'disabledChange' },
            { emit: 'editingChange' },
            { emit: 'elementAttrChange' },
            { emit: 'emptyViewTemplateChange' },
            { emit: 'fileUploaderOptionsChange' },
            { emit: 'focusStateEnabledChange' },
            { emit: 'heightChange' },
            { emit: 'hintChange' },
            { emit: 'hoverStateEnabledChange' },
            { emit: 'inputFieldTextChange' },
            { emit: 'itemsChange' },
            { emit: 'messageTemplateChange' },
            { emit: 'messageTimestampFormatChange' },
            { emit: 'reloadOnChangeChange' },
            { emit: 'rtlEnabledChange' },
            { emit: 'sendButtonOptionsChange' },
            { emit: 'showAvatarChange' },
            { emit: 'showDayHeadersChange' },
            { emit: 'showMessageTimestampChange' },
            { emit: 'showUserNameChange' },
            { emit: 'speechToTextEnabledChange' },
            { emit: 'speechToTextOptionsChange' },
            { emit: 'suggestionsChange' },
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
    DxChatComponent,
    DxiAlertModule,
    DxoDayHeaderFormatModule,
    DxoEditingModule,
    DxiItemModule,
    DxoAuthorModule,
    DxoMessageTimestampFormatModule,
    DxiTypingUserModule,
    DxoUserModule,
    DxiChatAlertModule,
    DxiChatAttachmentModule,
    DxoChatAuthorModule,
    DxiChatChatItemModule,
    DxoChatCustomSpeechRecognizerModule,
    DxoChatDayHeaderFormatModule,
    DxoChatEditingModule,
    DxoChatFileUploaderOptionsModule,
    DxiChatItemModule,
    DxoChatMessageTimestampFormatModule,
    DxoChatSendButtonOptionsModule,
    DxoChatSpeechRecognitionConfigModule,
    DxoChatSpeechToTextOptionsModule,
    DxoChatSuggestionsModule,
    DxiChatSuggestionsItemModule,
    DxiChatTypingUserModule,
    DxoChatUserModule,
    DxIntegrationModule,
    DxTemplateModule
  ],
  exports: [
    DxChatComponent,
    DxiAlertModule,
    DxoDayHeaderFormatModule,
    DxoEditingModule,
    DxiItemModule,
    DxoAuthorModule,
    DxoMessageTimestampFormatModule,
    DxiTypingUserModule,
    DxoUserModule,
    DxiChatAlertModule,
    DxiChatAttachmentModule,
    DxoChatAuthorModule,
    DxiChatChatItemModule,
    DxoChatCustomSpeechRecognizerModule,
    DxoChatDayHeaderFormatModule,
    DxoChatEditingModule,
    DxoChatFileUploaderOptionsModule,
    DxiChatItemModule,
    DxoChatMessageTimestampFormatModule,
    DxoChatSendButtonOptionsModule,
    DxoChatSpeechRecognitionConfigModule,
    DxoChatSpeechToTextOptionsModule,
    DxoChatSuggestionsModule,
    DxiChatSuggestionsItemModule,
    DxiChatTypingUserModule,
    DxoChatUserModule,
    DxTemplateModule
  ]
})
export class DxChatModule { }

export * from 'devextreme-angular/ui/chat/nested';

import type * as DxChatTypes from "devextreme/ui/chat_types";
export { DxChatTypes };


