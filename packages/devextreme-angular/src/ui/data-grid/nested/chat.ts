/* tslint:disable:max-line-length */


import {
    Component,
    OnInit,
    OnDestroy,
    NgModule,
    Host,
    SkipSelf,
    Input,
    Output,
    EventEmitter,
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

import {
    DxIntegrationModule,
    NestedOptionHost,
    CollectionNestedOption,
} from 'devextreme-angular/core';
import { NestedOption } from 'devextreme-angular/core';

import {
    PROPERTY_TOKEN_alerts,
    PROPERTY_TOKEN_items,
    PROPERTY_TOKEN_typingUsers,
} from 'devextreme-angular/core/tokens';

@Component({
    selector: 'dxo-data-grid-chat',
    template: '',
    styles: [''],
    imports: [ DxIntegrationModule ],
    providers: [NestedOptionHost]
})
export class DxoDataGridChatComponent extends NestedOption implements OnDestroy, OnInit  {
    @ContentChildren(PROPERTY_TOKEN_alerts)
    set _alertsContentChildren(value: QueryList<CollectionNestedOption>) {
        this.setChildren('alerts', value);
    }
    
    @ContentChildren(PROPERTY_TOKEN_items)
    set _itemsContentChildren(value: QueryList<CollectionNestedOption>) {
        this.setChildren('items', value);
    }
    
    @ContentChildren(PROPERTY_TOKEN_typingUsers)
    set _typingUsersContentChildren(value: QueryList<CollectionNestedOption>) {
        this.setChildren('typingUsers', value);
    }
    
    @Input()
    get accessKey(): string | undefined {
        return this._getOption('accessKey');
    }
    set accessKey(value: string | undefined) {
        this._setOption('accessKey', value);
    }

    @Input()
    get activeStateEnabled(): boolean {
        return this._getOption('activeStateEnabled');
    }
    set activeStateEnabled(value: boolean) {
        this._setOption('activeStateEnabled', value);
    }

    @Input()
    get alerts(): Array<Alert> {
        return this._getOption('alerts');
    }
    set alerts(value: Array<Alert>) {
        this._setOption('alerts', value);
    }

    @Input()
    get dataSource(): Array<Message> | DataSource | DataSourceOptions | null | Store | string {
        return this._getOption('dataSource');
    }
    set dataSource(value: Array<Message> | DataSource | DataSourceOptions | null | Store | string) {
        this._setOption('dataSource', value);
    }

    @Input()
    get dayHeaderFormat(): Format {
        return this._getOption('dayHeaderFormat');
    }
    set dayHeaderFormat(value: Format) {
        this._setOption('dayHeaderFormat', value);
    }

    @Input()
    get disabled(): boolean {
        return this._getOption('disabled');
    }
    set disabled(value: boolean) {
        this._setOption('disabled', value);
    }

    @Input()
    get editing(): { allowDeleting?: boolean | ((options: { component: dxChat, message: Message }) => boolean), allowUpdating?: boolean | ((options: { component: dxChat, message: Message }) => boolean) } {
        return this._getOption('editing');
    }
    set editing(value: { allowDeleting?: boolean | ((options: { component: dxChat, message: Message }) => boolean), allowUpdating?: boolean | ((options: { component: dxChat, message: Message }) => boolean) }) {
        this._setOption('editing', value);
    }

    @Input()
    get elementAttr(): Record<string, any> {
        return this._getOption('elementAttr');
    }
    set elementAttr(value: Record<string, any>) {
        this._setOption('elementAttr', value);
    }

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

    @Input()
    get focusStateEnabled(): boolean {
        return this._getOption('focusStateEnabled');
    }
    set focusStateEnabled(value: boolean) {
        this._setOption('focusStateEnabled', value);
    }

    @Input()
    get height(): number | string | undefined {
        return this._getOption('height');
    }
    set height(value: number | string | undefined) {
        this._setOption('height', value);
    }

    @Input()
    get hint(): string | undefined {
        return this._getOption('hint');
    }
    set hint(value: string | undefined) {
        this._setOption('hint', value);
    }

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

    @Input()
    get items(): Array<Message> {
        return this._getOption('items');
    }
    set items(value: Array<Message>) {
        this._setOption('items', value);
    }

    @Input()
    get messageTemplate(): any {
        return this._getOption('messageTemplate');
    }
    set messageTemplate(value: any) {
        this._setOption('messageTemplate', value);
    }

    @Input()
    get messageTimestampFormat(): Format {
        return this._getOption('messageTimestampFormat');
    }
    set messageTimestampFormat(value: Format) {
        this._setOption('messageTimestampFormat', value);
    }

    @Input()
    get onAttachmentDownloadClick(): ((e: AttachmentDownloadClickEvent) => void) | undefined {
        return this._getOption('onAttachmentDownloadClick');
    }
    set onAttachmentDownloadClick(value: ((e: AttachmentDownloadClickEvent) => void) | undefined) {
        this._setOption('onAttachmentDownloadClick', value);
    }

    @Input()
    get onDisposing(): ((e: DisposingEvent) => void) {
        return this._getOption('onDisposing');
    }
    set onDisposing(value: ((e: DisposingEvent) => void)) {
        this._setOption('onDisposing', value);
    }

    @Input()
    get onInitialized(): ((e: InitializedEvent) => void) {
        return this._getOption('onInitialized');
    }
    set onInitialized(value: ((e: InitializedEvent) => void)) {
        this._setOption('onInitialized', value);
    }

    @Input()
    get onInputFieldTextChanged(): ((e: InputFieldTextChangedEvent) => void) | undefined {
        return this._getOption('onInputFieldTextChanged');
    }
    set onInputFieldTextChanged(value: ((e: InputFieldTextChangedEvent) => void) | undefined) {
        this._setOption('onInputFieldTextChanged', value);
    }

    @Input()
    get onMessageDeleted(): ((e: MessageDeletedEvent) => void) | undefined {
        return this._getOption('onMessageDeleted');
    }
    set onMessageDeleted(value: ((e: MessageDeletedEvent) => void) | undefined) {
        this._setOption('onMessageDeleted', value);
    }

    @Input()
    get onMessageDeleting(): ((e: MessageDeletingEvent) => void) | undefined {
        return this._getOption('onMessageDeleting');
    }
    set onMessageDeleting(value: ((e: MessageDeletingEvent) => void) | undefined) {
        this._setOption('onMessageDeleting', value);
    }

    @Input()
    get onMessageEditCanceled(): ((e: MessageEditCanceledEvent) => void) | undefined {
        return this._getOption('onMessageEditCanceled');
    }
    set onMessageEditCanceled(value: ((e: MessageEditCanceledEvent) => void) | undefined) {
        this._setOption('onMessageEditCanceled', value);
    }

    @Input()
    get onMessageEditingStart(): ((e: MessageEditingStartEvent) => void) | undefined {
        return this._getOption('onMessageEditingStart');
    }
    set onMessageEditingStart(value: ((e: MessageEditingStartEvent) => void) | undefined) {
        this._setOption('onMessageEditingStart', value);
    }

    @Input()
    get onMessageEntered(): ((e: MessageEnteredEvent) => void) | undefined {
        return this._getOption('onMessageEntered');
    }
    set onMessageEntered(value: ((e: MessageEnteredEvent) => void) | undefined) {
        this._setOption('onMessageEntered', value);
    }

    @Input()
    get onMessageUpdated(): ((e: MessageUpdatedEvent) => void) | undefined {
        return this._getOption('onMessageUpdated');
    }
    set onMessageUpdated(value: ((e: MessageUpdatedEvent) => void) | undefined) {
        this._setOption('onMessageUpdated', value);
    }

    @Input()
    get onMessageUpdating(): ((e: MessageUpdatingEvent) => void) | undefined {
        return this._getOption('onMessageUpdating');
    }
    set onMessageUpdating(value: ((e: MessageUpdatingEvent) => void) | undefined) {
        this._setOption('onMessageUpdating', value);
    }

    @Input()
    get onOptionChanged(): ((e: OptionChangedEvent) => void) {
        return this._getOption('onOptionChanged');
    }
    set onOptionChanged(value: ((e: OptionChangedEvent) => void)) {
        this._setOption('onOptionChanged', value);
    }

    @Input()
    get onTypingEnd(): ((e: TypingEndEvent) => void) | undefined {
        return this._getOption('onTypingEnd');
    }
    set onTypingEnd(value: ((e: TypingEndEvent) => void) | undefined) {
        this._setOption('onTypingEnd', value);
    }

    @Input()
    get onTypingStart(): ((e: TypingStartEvent) => void) | undefined {
        return this._getOption('onTypingStart');
    }
    set onTypingStart(value: ((e: TypingStartEvent) => void) | undefined) {
        this._setOption('onTypingStart', value);
    }

    @Input()
    get reloadOnChange(): boolean {
        return this._getOption('reloadOnChange');
    }
    set reloadOnChange(value: boolean) {
        this._setOption('reloadOnChange', value);
    }

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

    @Input()
    get showAvatar(): boolean {
        return this._getOption('showAvatar');
    }
    set showAvatar(value: boolean) {
        this._setOption('showAvatar', value);
    }

    @Input()
    get showDayHeaders(): boolean {
        return this._getOption('showDayHeaders');
    }
    set showDayHeaders(value: boolean) {
        this._setOption('showDayHeaders', value);
    }

    @Input()
    get showMessageTimestamp(): boolean {
        return this._getOption('showMessageTimestamp');
    }
    set showMessageTimestamp(value: boolean) {
        this._setOption('showMessageTimestamp', value);
    }

    @Input()
    get showUserName(): boolean {
        return this._getOption('showUserName');
    }
    set showUserName(value: boolean) {
        this._setOption('showUserName', value);
    }

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

    @Input()
    get typingUsers(): Array<User> {
        return this._getOption('typingUsers');
    }
    set typingUsers(value: Array<User>) {
        this._setOption('typingUsers', value);
    }

    @Input()
    get user(): User {
        return this._getOption('user');
    }
    set user(value: User) {
        this._setOption('user', value);
    }

    @Input()
    get visible(): boolean {
        return this._getOption('visible');
    }
    set visible(value: boolean) {
        this._setOption('visible', value);
    }

    @Input()
    get width(): number | string | undefined {
        return this._getOption('width');
    }
    set width(value: number | string | undefined) {
        this._setOption('width', value);
    }


    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() itemsChange: EventEmitter<Array<Message>>;
    protected get _optionPath() {
        return 'chat';
    }


    constructor(@SkipSelf() @Host() parentOptionHost: NestedOptionHost,
            @Host() optionHost: NestedOptionHost) {
        super();
        this._createEventEmitters([
            { emit: 'itemsChange' }
        ]);

        parentOptionHost.setNestedOption(this);
        optionHost.setHost(this, this._fullOptionPath.bind(this));
    }


    ngOnInit() {
        this._addRecreatedComponent();
    }

    ngOnDestroy() {
        this._addRemovedOption(this._getOptionPath());
    }


}

@NgModule({
  imports: [
    DxoDataGridChatComponent
  ],
  exports: [
    DxoDataGridChatComponent
  ],
})
export class DxoDataGridChatModule { }
