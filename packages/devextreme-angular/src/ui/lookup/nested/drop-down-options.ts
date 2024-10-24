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




import { event } from 'devextreme/events/index';
import { ContentReadyEvent, DisposingEvent, HiddenEvent, HidingEvent, InitializedEvent, OptionChangedEvent, ShowingEvent, ShownEvent, TitleRenderedEvent } from 'devextreme/ui/popover';
import { PositionConfig } from 'devextreme/animation/position';
import { dxPopupToolbarItem } from 'devextreme/ui/popup';

import {
    NestedOptionHost,
} from 'devextreme-angular/core';
import { NestedOption } from 'devextreme-angular/core';


@Component({
    selector: 'dxo-lookup-drop-down-options',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoLookupDropDownOptionsComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get animation(): Record<string, any> {
        return this._getOption('animation');
    }
    set animation(value: Record<string, any>) {
        this._setOption('animation', value);
    }

    @Input()
    get bindingOptions(): Record<string, any> {
        return this._getOption('bindingOptions');
    }
    set bindingOptions(value: Record<string, any>) {
        this._setOption('bindingOptions', value);
    }

    @Input()
    get closeOnOutsideClick(): boolean | ((event: event) => boolean) {
        return this._getOption('closeOnOutsideClick');
    }
    set closeOnOutsideClick(value: boolean | ((event: event) => boolean)) {
        this._setOption('closeOnOutsideClick', value);
    }

    @Input()
    get container(): any | string {
        return this._getOption('container');
    }
    set container(value: any | string) {
        this._setOption('container', value);
    }

    @Input()
    get contentTemplate(): any {
        return this._getOption('contentTemplate');
    }
    set contentTemplate(value: any) {
        this._setOption('contentTemplate', value);
    }

    @Input()
    get deferRendering(): boolean {
        return this._getOption('deferRendering');
    }
    set deferRendering(value: boolean) {
        this._setOption('deferRendering', value);
    }

    @Input()
    get disabled(): boolean {
        return this._getOption('disabled');
    }
    set disabled(value: boolean) {
        this._setOption('disabled', value);
    }

    @Input()
    get enableBodyScroll(): boolean {
        return this._getOption('enableBodyScroll');
    }
    set enableBodyScroll(value: boolean) {
        this._setOption('enableBodyScroll', value);
    }

    @Input()
    get height(): (() => number | string) | number | string {
        return this._getOption('height');
    }
    set height(value: (() => number | string) | number | string) {
        this._setOption('height', value);
    }

    @Input()
    get hideEvent(): Record<string, any> | string {
        return this._getOption('hideEvent');
    }
    set hideEvent(value: Record<string, any> | string) {
        this._setOption('hideEvent', value);
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
    get hint(): string {
        return this._getOption('hint');
    }
    set hint(value: string) {
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
    get maxHeight(): (() => number | string) | number | string {
        return this._getOption('maxHeight');
    }
    set maxHeight(value: (() => number | string) | number | string) {
        this._setOption('maxHeight', value);
    }

    @Input()
    get maxWidth(): (() => number | string) | number | string {
        return this._getOption('maxWidth');
    }
    set maxWidth(value: (() => number | string) | number | string) {
        this._setOption('maxWidth', value);
    }

    @Input()
    get minHeight(): (() => number | string) | number | string {
        return this._getOption('minHeight');
    }
    set minHeight(value: (() => number | string) | number | string) {
        this._setOption('minHeight', value);
    }

    @Input()
    get minWidth(): (() => number | string) | number | string {
        return this._getOption('minWidth');
    }
    set minWidth(value: (() => number | string) | number | string) {
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
    get onTitleRendered(): ((e: TitleRenderedEvent) => void) {
        return this._getOption('onTitleRendered');
    }
    set onTitleRendered(value: ((e: TitleRenderedEvent) => void)) {
        this._setOption('onTitleRendered', value);
    }

    @Input()
    get position(): PositionConfig | "bottom" | "left" | "right" | "top" {
        return this._getOption('position');
    }
    set position(value: PositionConfig | "bottom" | "left" | "right" | "top") {
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
    get showCloseButton(): boolean {
        return this._getOption('showCloseButton');
    }
    set showCloseButton(value: boolean) {
        this._setOption('showCloseButton', value);
    }

    @Input()
    get showEvent(): Record<string, any> | string {
        return this._getOption('showEvent');
    }
    set showEvent(value: Record<string, any> | string) {
        this._setOption('showEvent', value);
    }

    @Input()
    get showTitle(): boolean {
        return this._getOption('showTitle');
    }
    set showTitle(value: boolean) {
        this._setOption('showTitle', value);
    }

    @Input()
    get target(): any | string {
        return this._getOption('target');
    }
    set target(value: any | string) {
        this._setOption('target', value);
    }

    @Input()
    get title(): string {
        return this._getOption('title');
    }
    set title(value: string) {
        this._setOption('title', value);
    }

    @Input()
    get titleTemplate(): any {
        return this._getOption('titleTemplate');
    }
    set titleTemplate(value: any) {
        this._setOption('titleTemplate', value);
    }

    @Input()
    get toolbarItems(): Array<dxPopupToolbarItem> {
        return this._getOption('toolbarItems');
    }
    set toolbarItems(value: Array<dxPopupToolbarItem>) {
        this._setOption('toolbarItems', value);
    }

    @Input()
    get visible(): boolean {
        return this._getOption('visible');
    }
    set visible(value: boolean) {
        this._setOption('visible', value);
    }

    @Input()
    get width(): (() => number | string) | number | string {
        return this._getOption('width');
    }
    set width(value: (() => number | string) | number | string) {
        this._setOption('width', value);
    }

    @Input()
    get wrapperAttr(): any {
        return this._getOption('wrapperAttr');
    }
    set wrapperAttr(value: any) {
        this._setOption('wrapperAttr', value);
    }


    protected get _optionPath() {
        return 'dropDownOptions';
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
  declarations: [
    DxoLookupDropDownOptionsComponent
  ],
  exports: [
    DxoLookupDropDownOptionsComponent
  ],
})
export class DxoLookupDropDownOptionsModule { }
