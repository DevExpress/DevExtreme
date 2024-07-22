/* tslint:disable:max-line-length */

import { NestedOption } from 'devextreme-angular/core';
import {
    Component,
} from '@angular/core';

import { EditorStyle, LabelMode, MaskMode, Position, TextBoxPredefinedButton, TextEditorButton, ValidationMessageMode, ValidationStatus } from 'devextreme/common';
import { ChangeEvent, ContentReadyEvent, CopyEvent, CutEvent, DisposingEvent, EnterKeyEvent, FocusInEvent, FocusOutEvent, InitializedEvent, InputEvent, KeyDownEvent, KeyUpEvent, OptionChangedEvent, PasteEvent, TextBoxType, ValueChangedEvent } from 'devextreme/ui/text_box';

@Component({
    template: ''
})
export abstract class DxoTextBoxOptions extends NestedOption {
    get accessKey(): string | undefined {
        return this._getOption('accessKey');
    }
    set accessKey(value: string | undefined) {
        this._setOption('accessKey', value);
    }

    get activeStateEnabled(): boolean {
        return this._getOption('activeStateEnabled');
    }
    set activeStateEnabled(value: boolean) {
        this._setOption('activeStateEnabled', value);
    }

    get buttons(): Array<TextBoxPredefinedButton | TextEditorButton | string> {
        return this._getOption('buttons');
    }
    set buttons(value: Array<TextBoxPredefinedButton | TextEditorButton | string>) {
        this._setOption('buttons', value);
    }

    get disabled(): boolean {
        return this._getOption('disabled');
    }
    set disabled(value: boolean) {
        this._setOption('disabled', value);
    }

    get elementAttr(): any {
        return this._getOption('elementAttr');
    }
    set elementAttr(value: any) {
        this._setOption('elementAttr', value);
    }

    get focusStateEnabled(): boolean {
        return this._getOption('focusStateEnabled');
    }
    set focusStateEnabled(value: boolean) {
        this._setOption('focusStateEnabled', value);
    }

    get height(): number | Function | string | undefined {
        return this._getOption('height');
    }
    set height(value: number | Function | string | undefined) {
        this._setOption('height', value);
    }

    get hint(): string | undefined {
        return this._getOption('hint');
    }
    set hint(value: string | undefined) {
        this._setOption('hint', value);
    }

    get hoverStateEnabled(): boolean {
        return this._getOption('hoverStateEnabled');
    }
    set hoverStateEnabled(value: boolean) {
        this._setOption('hoverStateEnabled', value);
    }

    get inputAttr(): any {
        return this._getOption('inputAttr');
    }
    set inputAttr(value: any) {
        this._setOption('inputAttr', value);
    }

    get isDirty(): boolean {
        return this._getOption('isDirty');
    }
    set isDirty(value: boolean) {
        this._setOption('isDirty', value);
    }

    get isValid(): boolean {
        return this._getOption('isValid');
    }
    set isValid(value: boolean) {
        this._setOption('isValid', value);
    }

    get label(): string {
        return this._getOption('label');
    }
    set label(value: string) {
        this._setOption('label', value);
    }

    get labelMode(): LabelMode {
        return this._getOption('labelMode');
    }
    set labelMode(value: LabelMode) {
        this._setOption('labelMode', value);
    }

    get mask(): string {
        return this._getOption('mask');
    }
    set mask(value: string) {
        this._setOption('mask', value);
    }

    get maskChar(): string {
        return this._getOption('maskChar');
    }
    set maskChar(value: string) {
        this._setOption('maskChar', value);
    }

    get maskInvalidMessage(): string {
        return this._getOption('maskInvalidMessage');
    }
    set maskInvalidMessage(value: string) {
        this._setOption('maskInvalidMessage', value);
    }

    get maskRules(): any {
        return this._getOption('maskRules');
    }
    set maskRules(value: any) {
        this._setOption('maskRules', value);
    }

    get maxLength(): number | string {
        return this._getOption('maxLength');
    }
    set maxLength(value: number | string) {
        this._setOption('maxLength', value);
    }

    get mode(): TextBoxType {
        return this._getOption('mode');
    }
    set mode(value: TextBoxType) {
        this._setOption('mode', value);
    }

    get name(): string {
        return this._getOption('name');
    }
    set name(value: string) {
        this._setOption('name', value);
    }

    get onChange(): ((e: ChangeEvent) => void) {
        return this._getOption('onChange');
    }
    set onChange(value: ((e: ChangeEvent) => void)) {
        this._setOption('onChange', value);
    }

    get onContentReady(): ((e: ContentReadyEvent) => void) {
        return this._getOption('onContentReady');
    }
    set onContentReady(value: ((e: ContentReadyEvent) => void)) {
        this._setOption('onContentReady', value);
    }

    get onCopy(): ((e: CopyEvent) => void) {
        return this._getOption('onCopy');
    }
    set onCopy(value: ((e: CopyEvent) => void)) {
        this._setOption('onCopy', value);
    }

    get onCut(): ((e: CutEvent) => void) {
        return this._getOption('onCut');
    }
    set onCut(value: ((e: CutEvent) => void)) {
        this._setOption('onCut', value);
    }

    get onDisposing(): ((e: DisposingEvent) => void) {
        return this._getOption('onDisposing');
    }
    set onDisposing(value: ((e: DisposingEvent) => void)) {
        this._setOption('onDisposing', value);
    }

    get onEnterKey(): ((e: EnterKeyEvent) => void) {
        return this._getOption('onEnterKey');
    }
    set onEnterKey(value: ((e: EnterKeyEvent) => void)) {
        this._setOption('onEnterKey', value);
    }

    get onFocusIn(): ((e: FocusInEvent) => void) {
        return this._getOption('onFocusIn');
    }
    set onFocusIn(value: ((e: FocusInEvent) => void)) {
        this._setOption('onFocusIn', value);
    }

    get onFocusOut(): ((e: FocusOutEvent) => void) {
        return this._getOption('onFocusOut');
    }
    set onFocusOut(value: ((e: FocusOutEvent) => void)) {
        this._setOption('onFocusOut', value);
    }

    get onInitialized(): ((e: InitializedEvent) => void) {
        return this._getOption('onInitialized');
    }
    set onInitialized(value: ((e: InitializedEvent) => void)) {
        this._setOption('onInitialized', value);
    }

    get onInput(): ((e: InputEvent) => void) {
        return this._getOption('onInput');
    }
    set onInput(value: ((e: InputEvent) => void)) {
        this._setOption('onInput', value);
    }

    get onKeyDown(): ((e: KeyDownEvent) => void) {
        return this._getOption('onKeyDown');
    }
    set onKeyDown(value: ((e: KeyDownEvent) => void)) {
        this._setOption('onKeyDown', value);
    }

    get onKeyUp(): ((e: KeyUpEvent) => void) {
        return this._getOption('onKeyUp');
    }
    set onKeyUp(value: ((e: KeyUpEvent) => void)) {
        this._setOption('onKeyUp', value);
    }

    get onOptionChanged(): ((e: OptionChangedEvent) => void) {
        return this._getOption('onOptionChanged');
    }
    set onOptionChanged(value: ((e: OptionChangedEvent) => void)) {
        this._setOption('onOptionChanged', value);
    }

    get onPaste(): ((e: PasteEvent) => void) {
        return this._getOption('onPaste');
    }
    set onPaste(value: ((e: PasteEvent) => void)) {
        this._setOption('onPaste', value);
    }

    get onValueChanged(): ((e: ValueChangedEvent) => void) {
        return this._getOption('onValueChanged');
    }
    set onValueChanged(value: ((e: ValueChangedEvent) => void)) {
        this._setOption('onValueChanged', value);
    }

    get placeholder(): string {
        return this._getOption('placeholder');
    }
    set placeholder(value: string) {
        this._setOption('placeholder', value);
    }

    get readOnly(): boolean {
        return this._getOption('readOnly');
    }
    set readOnly(value: boolean) {
        this._setOption('readOnly', value);
    }

    get rtlEnabled(): boolean {
        return this._getOption('rtlEnabled');
    }
    set rtlEnabled(value: boolean) {
        this._setOption('rtlEnabled', value);
    }

    get showClearButton(): boolean {
        return this._getOption('showClearButton');
    }
    set showClearButton(value: boolean) {
        this._setOption('showClearButton', value);
    }

    get showMaskMode(): MaskMode {
        return this._getOption('showMaskMode');
    }
    set showMaskMode(value: MaskMode) {
        this._setOption('showMaskMode', value);
    }

    get spellcheck(): boolean {
        return this._getOption('spellcheck');
    }
    set spellcheck(value: boolean) {
        this._setOption('spellcheck', value);
    }

    get stylingMode(): EditorStyle {
        return this._getOption('stylingMode');
    }
    set stylingMode(value: EditorStyle) {
        this._setOption('stylingMode', value);
    }

    get tabIndex(): number {
        return this._getOption('tabIndex');
    }
    set tabIndex(value: number) {
        this._setOption('tabIndex', value);
    }

    get text(): string {
        return this._getOption('text');
    }
    set text(value: string) {
        this._setOption('text', value);
    }

    get useMaskedValue(): boolean {
        return this._getOption('useMaskedValue');
    }
    set useMaskedValue(value: boolean) {
        this._setOption('useMaskedValue', value);
    }

    get validationError(): any {
        return this._getOption('validationError');
    }
    set validationError(value: any) {
        this._setOption('validationError', value);
    }

    get validationErrors(): Array<any> {
        return this._getOption('validationErrors');
    }
    set validationErrors(value: Array<any>) {
        this._setOption('validationErrors', value);
    }

    get validationMessageMode(): ValidationMessageMode {
        return this._getOption('validationMessageMode');
    }
    set validationMessageMode(value: ValidationMessageMode) {
        this._setOption('validationMessageMode', value);
    }

    get validationMessagePosition(): Position {
        return this._getOption('validationMessagePosition');
    }
    set validationMessagePosition(value: Position) {
        this._setOption('validationMessagePosition', value);
    }

    get validationStatus(): ValidationStatus {
        return this._getOption('validationStatus');
    }
    set validationStatus(value: ValidationStatus) {
        this._setOption('validationStatus', value);
    }

    get value(): string {
        return this._getOption('value');
    }
    set value(value: string) {
        this._setOption('value', value);
    }

    get valueChangeEvent(): string {
        return this._getOption('valueChangeEvent');
    }
    set valueChangeEvent(value: string) {
        this._setOption('valueChangeEvent', value);
    }

    get visible(): boolean {
        return this._getOption('visible');
    }
    set visible(value: boolean) {
        this._setOption('visible', value);
    }

    get width(): number | Function | string | undefined {
        return this._getOption('width');
    }
    set width(value: number | Function | string | undefined) {
        this._setOption('width', value);
    }
}
