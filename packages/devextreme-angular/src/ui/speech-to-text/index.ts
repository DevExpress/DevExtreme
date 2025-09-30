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
    EventEmitter
} from '@angular/core';


import { CustomSpeechRecognizer, ContentReadyEvent, DisposingEvent, EndEvent, ErrorEvent, InitializedEvent, OptionChangedEvent, ResultEvent, StartClickEvent, StopClickEvent, SpeechRecognitionConfig } from 'devextreme/ui/speech_to_text';
import { ButtonStyle, ButtonType } from 'devextreme/common';

import DxSpeechToText from 'devextreme/ui/speech_to_text';


import {
    DxComponent,
    DxTemplateHost,
    DxIntegrationModule,
    DxTemplateModule,
    NestedOptionHost,
    WatcherHelper
} from 'devextreme-angular/core';


import { DxoSpeechToTextCustomSpeechRecognizerModule } from 'devextreme-angular/ui/speech-to-text/nested';
import { DxoSpeechToTextSpeechRecognitionConfigModule } from 'devextreme-angular/ui/speech-to-text/nested';





@Component({
    selector: 'dx-speech-to-text',
    standalone: true,
    template: '',
    host: { ngSkipHydration: 'true' },
    imports: [ DxIntegrationModule ],
    providers: [
        DxTemplateHost,
        WatcherHelper,
        NestedOptionHost
    ]
})
export class DxSpeechToTextComponent extends DxComponent implements OnDestroy {
    instance: DxSpeechToText = null;

    
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

    /**
    
     * [descr:undefined]
    
    
     */
    @Output() onContentReady: EventEmitter<ContentReadyEvent>;

    /**
    
     * [descr:undefined]
    
    
     */
    @Output() onDisposing: EventEmitter<DisposingEvent>;

    /**
    
     * [descr:undefined]
    
    
     */
    @Output() onEnd: EventEmitter<EndEvent>;

    /**
    
     * [descr:undefined]
    
    
     */
    @Output() onError: EventEmitter<ErrorEvent>;

    /**
    
     * [descr:undefined]
    
    
     */
    @Output() onInitialized: EventEmitter<InitializedEvent>;

    /**
    
     * [descr:undefined]
    
    
     */
    @Output() onOptionChanged: EventEmitter<OptionChangedEvent>;

    /**
    
     * [descr:undefined]
    
    
     */
    @Output() onResult: EventEmitter<ResultEvent>;

    /**
    
     * [descr:undefined]
    
    
     */
    @Output() onStartClick: EventEmitter<StartClickEvent>;

    /**
    
     * [descr:undefined]
    
    
     */
    @Output() onStopClick: EventEmitter<StopClickEvent>;

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
    @Output() customSpeechRecognizerChange: EventEmitter<CustomSpeechRecognizer>;

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
    @Output() rtlEnabledChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() speechRecognitionConfigChange: EventEmitter<Record<string, any> | SpeechRecognitionConfig>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() startIconChange: EventEmitter<string>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() startTextChange: EventEmitter<string>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() stopIconChange: EventEmitter<string>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() stopTextChange: EventEmitter<string>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() stylingModeChange: EventEmitter<ButtonStyle>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() tabIndexChange: EventEmitter<number>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() typeChange: EventEmitter<ButtonType | string>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() visibleChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() widthChange: EventEmitter<number | string | undefined>;








    constructor(elementRef: ElementRef, ngZone: NgZone, templateHost: DxTemplateHost,
            _watcherHelper: WatcherHelper,
            optionHost: NestedOptionHost,
            transferState: TransferState,
            @Inject(PLATFORM_ID) platformId: any) {

        super(elementRef, ngZone, templateHost, _watcherHelper, transferState, platformId);

        this._createEventEmitters([
            { subscribe: 'contentReady', emit: 'onContentReady' },
            { subscribe: 'disposing', emit: 'onDisposing' },
            { subscribe: 'end', emit: 'onEnd' },
            { subscribe: 'error', emit: 'onError' },
            { subscribe: 'initialized', emit: 'onInitialized' },
            { subscribe: 'optionChanged', emit: 'onOptionChanged' },
            { subscribe: 'result', emit: 'onResult' },
            { subscribe: 'startClick', emit: 'onStartClick' },
            { subscribe: 'stopClick', emit: 'onStopClick' },
            { emit: 'accessKeyChange' },
            { emit: 'activeStateEnabledChange' },
            { emit: 'customSpeechRecognizerChange' },
            { emit: 'disabledChange' },
            { emit: 'elementAttrChange' },
            { emit: 'focusStateEnabledChange' },
            { emit: 'heightChange' },
            { emit: 'hintChange' },
            { emit: 'hoverStateEnabledChange' },
            { emit: 'rtlEnabledChange' },
            { emit: 'speechRecognitionConfigChange' },
            { emit: 'startIconChange' },
            { emit: 'startTextChange' },
            { emit: 'stopIconChange' },
            { emit: 'stopTextChange' },
            { emit: 'stylingModeChange' },
            { emit: 'tabIndexChange' },
            { emit: 'typeChange' },
            { emit: 'visibleChange' },
            { emit: 'widthChange' }
        ]);
        optionHost.setHost(this);
    }

    protected _createInstance(element, options) {

        return new DxSpeechToText(element, options);
    }


    ngOnDestroy() {
        this._destroyWidget();
    }

}

@NgModule({
  imports: [
    DxSpeechToTextComponent,
    DxoSpeechToTextCustomSpeechRecognizerModule,
    DxoSpeechToTextSpeechRecognitionConfigModule,
    DxIntegrationModule,
    DxTemplateModule
  ],
  exports: [
    DxSpeechToTextComponent,
    DxoSpeechToTextCustomSpeechRecognizerModule,
    DxoSpeechToTextSpeechRecognitionConfigModule,
    DxTemplateModule
  ]
})
export class DxSpeechToTextModule { }

export * from 'devextreme-angular/ui/speech-to-text/nested';

import type * as DxSpeechToTextTypes from "devextreme/ui/speech_to_text_types";
export { DxSpeechToTextTypes };


