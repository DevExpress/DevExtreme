/* tslint:disable:max-line-length */

import { NestedOption } from 'devextreme-angular/core';
import {
    Component,
} from '@angular/core';

import { ToolbarItemComponent, ToolbarItemLocation } from 'devextreme/common';
import { CardHeaderPredefinedToolbarItem } from 'devextreme/ui/card_view';
import { LocateInMenuMode, ShowTextMode } from 'devextreme/ui/toolbar';

@Component({
    template: ''
})
export abstract class DxoCardHeader extends NestedOption {
    get items(): Array<CardHeaderPredefinedToolbarItem | any | { cssClass?: string | undefined, disabled?: boolean, html?: string, locateInMenu?: LocateInMenuMode, location?: ToolbarItemLocation, menuItemTemplate?: any, name?: CardHeaderPredefinedToolbarItem | string, options?: any, showText?: ShowTextMode, template?: any, text?: string, visible?: boolean, widget?: ToolbarItemComponent }> {
        return this._getOption('items');
    }
    set items(value: Array<CardHeaderPredefinedToolbarItem | any | { cssClass?: string | undefined, disabled?: boolean, html?: string, locateInMenu?: LocateInMenuMode, location?: ToolbarItemLocation, menuItemTemplate?: any, name?: CardHeaderPredefinedToolbarItem | string, options?: any, showText?: ShowTextMode, template?: any, text?: string, visible?: boolean, widget?: ToolbarItemComponent }>) {
        this._setOption('items', value);
    }

    get template(): any {
        return this._getOption('template');
    }
    set template(value: any) {
        this._setOption('template', value);
    }

    get visible(): boolean {
        return this._getOption('visible');
    }
    set visible(value: boolean) {
        this._setOption('visible', value);
    }
}
