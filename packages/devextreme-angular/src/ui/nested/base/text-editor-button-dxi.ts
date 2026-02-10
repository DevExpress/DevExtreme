/* tslint:disable:max-line-length */

import { CollectionNestedOption } from 'devextreme-angular/core';
import {
    Component,
} from '@angular/core';

import { TextEditorButtonLocation } from 'devextreme/common';
import { Properties as dxButtonOptions } from 'devextreme/ui/button';
import { ColumnButtonClickEvent, DataGridPredefinedColumnButton } from 'devextreme/ui/data_grid';
import { TreeListPredefinedColumnButton } from 'devextreme/ui/tree_list';

@Component({
    template: ''
})
export abstract class DxiTextEditorButton extends CollectionNestedOption {
    get location(): TextEditorButtonLocation {
        return this._getOption('location');
    }
    set location(value: TextEditorButtonLocation) {
        this._setOption('location', value);
    }

    get name(): string | undefined | DataGridPredefinedColumnButton | TreeListPredefinedColumnButton {
        return this._getOption('name');
    }
    set name(value: string | undefined | DataGridPredefinedColumnButton | TreeListPredefinedColumnButton) {
        this._setOption('name', value);
    }

    get options(): dxButtonOptions | undefined {
        return this._getOption('options');
    }
    set options(value: dxButtonOptions | undefined) {
        this._setOption('options', value);
    }

    get cssClass(): string {
        return this._getOption('cssClass');
    }
    set cssClass(value: string) {
        this._setOption('cssClass', value);
    }

    get disabled(): boolean | Function {
        return this._getOption('disabled');
    }
    set disabled(value: boolean | Function) {
        this._setOption('disabled', value);
    }

    get hint(): string {
        return this._getOption('hint');
    }
    set hint(value: string) {
        this._setOption('hint', value);
    }

    get icon(): string {
        return this._getOption('icon');
    }
    set icon(value: string) {
        this._setOption('icon', value);
    }

    get onClick(): ((e: ColumnButtonClickEvent) => void) {
        return this._getOption('onClick');
    }
    set onClick(value: ((e: ColumnButtonClickEvent) => void)) {
        this._setOption('onClick', value);
    }

    get template(): any {
        return this._getOption('template');
    }
    set template(value: any) {
        this._setOption('template', value);
    }

    get text(): string {
        return this._getOption('text');
    }
    set text(value: string) {
        this._setOption('text', value);
    }

    get visible(): boolean | Function {
        return this._getOption('visible');
    }
    set visible(value: boolean | Function) {
        this._setOption('visible', value);
    }
}
