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


import { CustomSpeechRecognizer, ContentReadyEvent, DisposingEvent, ErrorEvent, InitializedEvent, OptionChangedEvent, ResultEvent, StartClickEvent, StopClickEvent, WebSpeechApiConfig } from 'devextreme/ui/speech_to_text';

import DxSpeechToText from 'devextreme/ui/speech_to_text';


import {
    DxComponent,
    DxTemplateHost,
    DxIntegrationModule,
    DxTemplateModule,
    NestedOptionHost,
    WatcherHelper
} from 'devextreme-angular/core';

import { DxoCustomSpeechRecognizerModule } from 'devextreme-angular/ui/nested';
import { DxoWebSpeechApiConfigModule } from 'devextreme-angular/ui/nested';

import { DxoSpeechToTextCustomSpeechRecognizerModule } from 'devextreme-angular/ui/speech-to-text/nested';
import { DxoSpeechToTextWebSpeechApiConfigModule } from 'devextreme-angular/ui/speech-to-text/nested';




/**
 * [descr:dxSpeechToText]

 */
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
     * [descr:dxSpeechToTextOptions.customSpeechRecognizer]
    
     */
    @Input()
    get customSpeechRecognizer(): CustomSpeechRecognizer {
        return this._getOption('customSpeechRecognizer');
    }
    set customSpeechRecognizer(value: CustomSpeechRecognizer) {
        this._setOption('customSpeechRecognizer', value);
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
     * [descr:dxSpeechToTextOptions.startIcon]
    
     */
    @Input()
    get startIcon(): string {
        return this._getOption('startIcon');
    }
    set startIcon(value: string) {
        this._setOption('startIcon', value);
    }


    /**
     * [descr:dxSpeechToTextOptions.startText]
    
     */
    @Input()
    get startText(): string {
        return this._getOption('startText');
    }
    set startText(value: string) {
        this._setOption('startText', value);
    }


    /**
     * [descr:dxSpeechToTextOptions.stopIcon]
    
     */
    @Input()
    get stopIcon(): string {
        return this._getOption('stopIcon');
    }
    set stopIcon(value: string) {
        this._setOption('stopIcon', value);
    }


    /**
     * [descr:dxSpeechToTextOptions.stopText]
    
     */
    @Input()
    get stopText(): string {
        return this._getOption('stopText');
    }
    set stopText(value: string) {
        this._setOption('stopText', value);
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
     * [descr:dxSpeechToTextOptions.webSpeechApiConfig]
    
     */
    @Input()
    get webSpeechApiConfig(): Record<string, any> | WebSpeechApiConfig {
        return this._getOption('webSpeechApiConfig');
    }
    set webSpeechApiConfig(value: Record<string, any> | WebSpeechApiConfig) {
        this._setOption('webSpeechApiConfig', value);
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
    
     * [descr:dxSpeechToTextOptions.onContentReady]
    
    
     */
    @Output() onContentReady: EventEmitter<ContentReadyEvent>;

    /**
    
     * [descr:dxSpeechToTextOptions.onDisposing]
    
    
     */
    @Output() onDisposing: EventEmitter<DisposingEvent>;

    /**
    
     * [descr:dxSpeechToTextOptions.onError]
    
    
     */
    @Output() onError: EventEmitter<ErrorEvent>;

    /**
    
     * [descr:dxSpeechToTextOptions.onInitialized]
    
    
     */
    @Output() onInitialized: EventEmitter<InitializedEvent>;

    /**
    
     * [descr:dxSpeechToTextOptions.onOptionChanged]
    
    
     */
    @Output() onOptionChanged: EventEmitter<OptionChangedEvent>;

    /**
    
     * [descr:dxSpeechToTextOptions.onResult]
    
    
     */
    @Output() onResult: EventEmitter<ResultEvent>;

    /**
    
     * [descr:dxSpeechToTextOptions.onStartClick]
    
    
     */
    @Output() onStartClick: EventEmitter<StartClickEvent>;

    /**
    
     * [descr:dxSpeechToTextOptions.onStopClick]
    
    
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
    @Output() tabIndexChange: EventEmitter<number>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() visibleChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() webSpeechApiConfigChange: EventEmitter<Record<string, any> | WebSpeechApiConfig>;

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
            { emit: 'startIconChange' },
            { emit: 'startTextChange' },
            { emit: 'stopIconChange' },
            { emit: 'stopTextChange' },
            { emit: 'tabIndexChange' },
            { emit: 'visibleChange' },
            { emit: 'webSpeechApiConfigChange' },
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
    DxoCustomSpeechRecognizerModule,
    DxoWebSpeechApiConfigModule,
    DxoSpeechToTextCustomSpeechRecognizerModule,
    DxoSpeechToTextWebSpeechApiConfigModule,
    DxIntegrationModule,
    DxTemplateModule
  ],
  exports: [
    DxSpeechToTextComponent,
    DxoCustomSpeechRecognizerModule,
    DxoWebSpeechApiConfigModule,
    DxoSpeechToTextCustomSpeechRecognizerModule,
    DxoSpeechToTextWebSpeechApiConfigModule,
    DxTemplateModule
  ]
})
export class DxSpeechToTextModule { }

export * from 'devextreme-angular/ui/speech-to-text/nested';

import type * as DxSpeechToTextTypes from "devextreme/ui/speech_to_text_types";
export { DxSpeechToTextTypes };


