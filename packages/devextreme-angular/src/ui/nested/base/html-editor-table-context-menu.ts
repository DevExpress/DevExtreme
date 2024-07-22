/* tslint:disable:max-line-length */

import { NestedOption } from 'devextreme-angular/core';
import {
    Component,
} from '@angular/core';

import { HtmlEditorPredefinedContextMenuItem } from 'devextreme/ui/html_editor';

@Component({
    template: ''
})
export abstract class DxoHtmlEditorTableContextMenu extends NestedOption {
    get enabled(): boolean {
        return this._getOption('enabled');
    }
    set enabled(value: boolean) {
        this._setOption('enabled', value);
    }

    get items(): Array<HtmlEditorPredefinedContextMenuItem | any | { beginGroup?: boolean, closeMenuOnClick?: boolean, disabled?: boolean, icon?: string, items?: Array<HtmlEditorPredefinedContextMenuItem | any>, name?: HtmlEditorPredefinedContextMenuItem | undefined, selectable?: boolean, selected?: boolean, template?: any, text?: string, visible?: boolean }> {
        return this._getOption('items');
    }
    set items(value: Array<HtmlEditorPredefinedContextMenuItem | any | { beginGroup?: boolean, closeMenuOnClick?: boolean, disabled?: boolean, icon?: string, items?: Array<HtmlEditorPredefinedContextMenuItem | any>, name?: HtmlEditorPredefinedContextMenuItem | undefined, selectable?: boolean, selected?: boolean, template?: any, text?: string, visible?: boolean }>) {
        this._setOption('items', value);
    }
}
