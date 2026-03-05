/* tslint:disable:max-line-length */


import {
    Component,
    OnInit,
    OnDestroy,
    NgModule,
    Host,
    SkipSelf,
    Input
} from '@angular/core';




import { CustomSpeechRecognizer, ContentReadyEvent, DisposingEvent, EndEvent, ErrorEvent, InitializedEvent, OptionChangedEvent, ResultEvent, StartClickEvent, StopClickEvent, SpeechRecognitionConfig } from 'devextreme/ui/speech_to_text';
import { ButtonStyle, ButtonType } from 'devextreme/common';

import {
    DxIntegrationModule,
    NestedOptionHost,
} from 'devextreme-angular/core';
import { NestedOption } from 'devextreme-angular/core';


@Component({
    selector: 'dxo-chat-speech-to-text-options',
    standalone: true,
    template: '',
    styles: [''],
    imports: [ DxIntegrationModule ],
    providers: [NestedOptionHost]
})
export class DxoChatSpeechToTextOptionsComponent extends NestedOption implements OnDestroy, OnInit  {
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
    get customSpeechRecognizer(): CustomSpeechRecognizer {
        return this._getOption('customSpeechRecognizer');
    }
    set customSpeechRecognizer(value: CustomSpeechRecognizer) {
        this._setOption('customSpeechRecognizer', value);
    }

    @Input()
    get disabled(): boolean {
        return this._getOption('disabled');
    }
    set disabled(value: boolean) {
        this._setOption('disabled', value);
    }

    @Input()
    get elementAttr(): Record<string, any> {
        return this._getOption('elementAttr');
    }
    set elementAttr(value: Record<string, any>) {
        this._setOption('elementAttr', value);
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
    get onContentReady(): ((e: ContentReadyEvent) => void) {
        return this._getOption('onContentReady');
    }
    set onContentReady(value: ((e: ContentReadyEvent) => void)) {
        this._setOption('onContentReady', value);
    }

    @Input()
    get onDisposing(): ((e: DisposingEvent) => void) {
        return this._getOption('onDisposing');
    }
    set onDisposing(value: ((e: DisposingEvent) => void)) {
        this._setOption('onDisposing', value);
    }

    @Input()
    get onEnd(): ((e: EndEvent) => void) | undefined {
        return this._getOption('onEnd');
    }
    set onEnd(value: ((e: EndEvent) => void) | undefined) {
        this._setOption('onEnd', value);
    }

    @Input()
    get onError(): ((e: ErrorEvent) => void) | undefined {
        return this._getOption('onError');
    }
    set onError(value: ((e: ErrorEvent) => void) | undefined) {
        this._setOption('onError', value);
    }

    @Input()
    get onInitialized(): ((e: InitializedEvent) => void) {
        return this._getOption('onInitialized');
    }
    set onInitialized(value: ((e: InitializedEvent) => void)) {
        this._setOption('onInitialized', value);
    }

    @Input()
    get onOptionChanged(): ((e: OptionChangedEvent) => void) {
        return this._getOption('onOptionChanged');
    }
    set onOptionChanged(value: ((e: OptionChangedEvent) => void)) {
        this._setOption('onOptionChanged', value);
    }

    @Input()
    get onResult(): ((e: ResultEvent) => void) | undefined {
        return this._getOption('onResult');
    }
    set onResult(value: ((e: ResultEvent) => void) | undefined) {
        this._setOption('onResult', value);
    }

    @Input()
    get onStartClick(): ((e: StartClickEvent) => void) | undefined {
        return this._getOption('onStartClick');
    }
    set onStartClick(value: ((e: StartClickEvent) => void) | undefined) {
        this._setOption('onStartClick', value);
    }

    @Input()
    get onStopClick(): ((e: StopClickEvent) => void) | undefined {
        return this._getOption('onStopClick');
    }
    set onStopClick(value: ((e: StopClickEvent) => void) | undefined) {
        this._setOption('onStopClick', value);
    }

    @Input()
    get rtlEnabled(): boolean {
        return this._getOption('rtlEnabled');
    }
    set rtlEnabled(value: boolean) {
        this._setOption('rtlEnabled', value);
    }

    @Input()
    get speechRecognitionConfig(): Record<string, any> | SpeechRecognitionConfig {
        return this._getOption('speechRecognitionConfig');
    }
    set speechRecognitionConfig(value: Record<string, any> | SpeechRecognitionConfig) {
        this._setOption('speechRecognitionConfig', value);
    }

    @Input()
    get startIcon(): string {
        return this._getOption('startIcon');
    }
    set startIcon(value: string) {
        this._setOption('startIcon', value);
    }

    @Input()
    get startText(): string {
        return this._getOption('startText');
    }
    set startText(value: string) {
        this._setOption('startText', value);
    }

    @Input()
    get stopIcon(): string {
        return this._getOption('stopIcon');
    }
    set stopIcon(value: string) {
        this._setOption('stopIcon', value);
    }

    @Input()
    get stopText(): string {
        return this._getOption('stopText');
    }
    set stopText(value: string) {
        this._setOption('stopText', value);
    }

    @Input()
    get stylingMode(): ButtonStyle {
        return this._getOption('stylingMode');
    }
    set stylingMode(value: ButtonStyle) {
        this._setOption('stylingMode', value);
    }

    @Input()
    get tabIndex(): number {
        return this._getOption('tabIndex');
    }
    set tabIndex(value: number) {
        this._setOption('tabIndex', value);
    }

    @Input()
    get type(): ButtonType | string {
        return this._getOption('type');
    }
    set type(value: ButtonType | string) {
        this._setOption('type', value);
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


    protected get _optionPath() {
        return 'speechToTextOptions';
    }


    constructor(@SkipSelf() @Host() parentOptionHost: NestedOptionHost,
            @Host() optionHost: NestedOptionHost) {
        super();
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
    DxoChatSpeechToTextOptionsComponent
  ],
  exports: [
    DxoChatSpeechToTextOptionsComponent
  ],
})
export class DxoChatSpeechToTextOptionsModule { }
