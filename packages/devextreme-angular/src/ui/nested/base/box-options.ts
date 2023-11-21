/* tslint:disable:max-line-length */

import { NestedOption } from 'devextreme-angular/core';
import {
    Component,
} from '@angular/core';

import DevExpress from 'devextreme/bundles/dx.all';
import { Store } from 'devextreme/data';
import DataSource, { Options as DataSourceOptions } from 'devextreme/data/data_source';
import { BoxDirection, ContentReadyEvent, CrosswiseDistribution, DisposingEvent, Distribution, dxBoxOptions, InitializedEvent, ItemClickEvent, ItemContextMenuEvent, ItemHoldEvent, ItemRenderedEvent, OptionChangedEvent } from 'devextreme/ui/box';

@Component({
    template: ''
})
export abstract class DxoBoxOptions extends NestedOption {
    get align(): Distribution {
        return this._getOption('align');
    }
    set align(value: Distribution) {
        this._setOption('align', value);
    }

    get crossAlign(): CrosswiseDistribution {
        return this._getOption('crossAlign');
    }
    set crossAlign(value: CrosswiseDistribution) {
        this._setOption('crossAlign', value);
    }

    get dataSource(): DataSource | DataSourceOptions | Store | null | string | Array<string | DevExpress.ui.dxBoxItem | any> {
        return this._getOption('dataSource');
    }
    set dataSource(value: DataSource | DataSourceOptions | Store | null | string | Array<string | DevExpress.ui.dxBoxItem | any>) {
        this._setOption('dataSource', value);
    }

    get direction(): BoxDirection {
        return this._getOption('direction');
    }
    set direction(value: BoxDirection) {
        this._setOption('direction', value);
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

    get height(): number | Function | string | undefined {
        return this._getOption('height');
    }
    set height(value: number | Function | string | undefined) {
        this._setOption('height', value);
    }

    get hoverStateEnabled(): boolean {
        return this._getOption('hoverStateEnabled');
    }
    set hoverStateEnabled(value: boolean) {
        this._setOption('hoverStateEnabled', value);
    }

    get itemHoldTimeout(): number {
        return this._getOption('itemHoldTimeout');
    }
    set itemHoldTimeout(value: number) {
        this._setOption('itemHoldTimeout', value);
    }

    get items(): Array<string | any | { baseSize?: number | string, box?: dxBoxOptions | undefined, disabled?: boolean, html?: string, ratio?: number, shrink?: number, template?: any, text?: string, visible?: boolean }> {
        return this._getOption('items');
    }
    set items(value: Array<string | any | { baseSize?: number | string, box?: dxBoxOptions | undefined, disabled?: boolean, html?: string, ratio?: number, shrink?: number, template?: any, text?: string, visible?: boolean }>) {
        this._setOption('items', value);
    }

    get itemTemplate(): any {
        return this._getOption('itemTemplate');
    }
    set itemTemplate(value: any) {
        this._setOption('itemTemplate', value);
    }

    get onContentReady(): Function {
        return this._getOption('onContentReady');
    }
    set onContentReady(value: Function) {
        this._setOption('onContentReady', value);
    }

    get onDisposing(): Function {
        return this._getOption('onDisposing');
    }
    set onDisposing(value: Function) {
        this._setOption('onDisposing', value);
    }

    get onInitialized(): Function {
        return this._getOption('onInitialized');
    }
    set onInitialized(value: Function) {
        this._setOption('onInitialized', value);
    }

    get onItemClick(): Function {
        return this._getOption('onItemClick');
    }
    set onItemClick(value: Function) {
        this._setOption('onItemClick', value);
    }

    get onItemContextMenu(): Function {
        return this._getOption('onItemContextMenu');
    }
    set onItemContextMenu(value: Function) {
        this._setOption('onItemContextMenu', value);
    }

    get onItemHold(): Function {
        return this._getOption('onItemHold');
    }
    set onItemHold(value: Function) {
        this._setOption('onItemHold', value);
    }

    get onItemRendered(): Function {
        return this._getOption('onItemRendered');
    }
    set onItemRendered(value: Function) {
        this._setOption('onItemRendered', value);
    }

    get onOptionChanged(): Function {
        return this._getOption('onOptionChanged');
    }
    set onOptionChanged(value: Function) {
        this._setOption('onOptionChanged', value);
    }

    get rtlEnabled(): boolean {
        return this._getOption('rtlEnabled');
    }
    set rtlEnabled(value: boolean) {
        this._setOption('rtlEnabled', value);
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
