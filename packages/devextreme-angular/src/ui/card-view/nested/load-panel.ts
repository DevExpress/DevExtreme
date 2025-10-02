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
    EventEmitter
} from '@angular/core';




import { AnimationConfig, PositionConfig } from 'devextreme/common/core/animation';
import { event } from 'devextreme/events/events.types';
import { LoadIndicatorOptions } from 'devextreme/ui/load_indicator';
import { ContentReadyEvent, DisposingEvent, HiddenEvent, HidingEvent, InitializedEvent, OptionChangedEvent, ShowingEvent, ShownEvent } from 'devextreme/ui/load_panel';
import { PositionAlignment } from 'devextreme/common';

import {
    DxIntegrationModule,
    NestedOptionHost,
} from 'devextreme-angular/core';
import { NestedOption } from 'devextreme-angular/core';


@Component({
    selector: 'dxo-card-view-load-panel',
    standalone: true,
    template: '',
    styles: [''],
    imports: [ DxIntegrationModule ],
    providers: [NestedOptionHost]
})
export class DxoCardViewLoadPanelComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get animation(): { hide?: AnimationConfig, show?: AnimationConfig } {
        return this._getOption('animation');
    }
    set animation(value: { hide?: AnimationConfig, show?: AnimationConfig }) {
        this._setOption('animation', value);
    }

    @Input()
    get container(): any | string | undefined {
        return this._getOption('container');
    }
    set container(value: any | string | undefined) {
        this._setOption('container', value);
    }

    @Input()
    get deferRendering(): boolean {
        return this._getOption('deferRendering');
    }
    set deferRendering(value: boolean) {
        this._setOption('deferRendering', value);
    }

    @Input()
    get delay(): number {
        return this._getOption('delay');
    }
    set delay(value: number) {
        this._setOption('delay', value);
    }

    @Input()
    get focusStateEnabled(): boolean {
        return this._getOption('focusStateEnabled');
    }
    set focusStateEnabled(value: boolean) {
        this._setOption('focusStateEnabled', value);
    }

    @Input()
    get height(): number | string {
        return this._getOption('height');
    }
    set height(value: number | string) {
        this._setOption('height', value);
    }

    @Input()
    get hideOnOutsideClick(): boolean | ((event: event) => boolean) {
        return this._getOption('hideOnOutsideClick');
    }
    set hideOnOutsideClick(value: boolean | ((event: event) => boolean)) {
        this._setOption('hideOnOutsideClick', value);
    }

    @Input()
    get hideOnParentScroll(): boolean {
        return this._getOption('hideOnParentScroll');
    }
    set hideOnParentScroll(value: boolean) {
        this._setOption('hideOnParentScroll', value);
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
    get indicatorOptions(): LoadIndicatorOptions {
        return this._getOption('indicatorOptions');
    }
    set indicatorOptions(value: LoadIndicatorOptions) {
        this._setOption('indicatorOptions', value);
    }

    @Input()
    get indicatorSrc(): string {
        return this._getOption('indicatorSrc');
    }
    set indicatorSrc(value: string) {
        this._setOption('indicatorSrc', value);
    }

    @Input()
    get maxHeight(): number | string {
        return this._getOption('maxHeight');
    }
    set maxHeight(value: number | string) {
        this._setOption('maxHeight', value);
    }

    @Input()
    get maxWidth(): number | string {
        return this._getOption('maxWidth');
    }
    set maxWidth(value: number | string) {
        this._setOption('maxWidth', value);
    }

    @Input()
    get message(): string {
        return this._getOption('message');
    }
    set message(value: string) {
        this._setOption('message', value);
    }

    @Input()
    get minHeight(): number | string {
        return this._getOption('minHeight');
    }
    set minHeight(value: number | string) {
        this._setOption('minHeight', value);
    }

    @Input()
    get minWidth(): number | string {
        return this._getOption('minWidth');
    }
    set minWidth(value: number | string) {
        this._setOption('minWidth', value);
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
    get onHidden(): ((e: HiddenEvent) => void) {
        return this._getOption('onHidden');
    }
    set onHidden(value: ((e: HiddenEvent) => void)) {
        this._setOption('onHidden', value);
    }

    @Input()
    get onHiding(): ((e: HidingEvent) => void) {
        return this._getOption('onHiding');
    }
    set onHiding(value: ((e: HidingEvent) => void)) {
        this._setOption('onHiding', value);
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
    get onShowing(): ((e: ShowingEvent) => void) {
        return this._getOption('onShowing');
    }
    set onShowing(value: ((e: ShowingEvent) => void)) {
        this._setOption('onShowing', value);
    }

    @Input()
    get onShown(): ((e: ShownEvent) => void) {
        return this._getOption('onShown');
    }
    set onShown(value: ((e: ShownEvent) => void)) {
        this._setOption('onShown', value);
    }

    @Input()
    get position(): Function | PositionAlignment | PositionConfig {
        return this._getOption('position');
    }
    set position(value: Function | PositionAlignment | PositionConfig) {
        this._setOption('position', value);
    }

    @Input()
    get rtlEnabled(): boolean {
        return this._getOption('rtlEnabled');
    }
    set rtlEnabled(value: boolean) {
        this._setOption('rtlEnabled', value);
    }

    @Input()
    get shading(): boolean {
        return this._getOption('shading');
    }
    set shading(value: boolean) {
        this._setOption('shading', value);
    }

    @Input()
    get shadingColor(): string {
        return this._getOption('shadingColor');
    }
    set shadingColor(value: string) {
        this._setOption('shadingColor', value);
    }

    @Input()
    get showIndicator(): boolean {
        return this._getOption('showIndicator');
    }
    set showIndicator(value: boolean) {
        this._setOption('showIndicator', value);
    }

    @Input()
    get showPane(): boolean {
        return this._getOption('showPane');
    }
    set showPane(value: boolean) {
        this._setOption('showPane', value);
    }

    @Input()
    get visible(): boolean {
        return this._getOption('visible');
    }
    set visible(value: boolean) {
        this._setOption('visible', value);
    }

    @Input()
    get width(): number | string {
        return this._getOption('width');
    }
    set width(value: number | string) {
        this._setOption('width', value);
    }

    @Input()
    get wrapperAttr(): any {
        return this._getOption('wrapperAttr');
    }
    set wrapperAttr(value: any) {
        this._setOption('wrapperAttr', value);
    }


    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() positionChange: EventEmitter<Function | PositionAlignment | PositionConfig>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() visibleChange: EventEmitter<boolean>;
    protected get _optionPath() {
        return 'loadPanel';
    }


    constructor(@SkipSelf() @Host() parentOptionHost: NestedOptionHost,
            @Host() optionHost: NestedOptionHost) {
        super();

        this._createEventEmitters([
            { emit: 'positionChange' },
            { emit: 'visibleChange' }
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
    DxoCardViewLoadPanelComponent
  ],
  exports: [
    DxoCardViewLoadPanelComponent
  ],
})
export class DxoCardViewLoadPanelModule { }
