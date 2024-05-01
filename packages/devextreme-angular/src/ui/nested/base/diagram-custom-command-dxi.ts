/* tslint:disable:max-line-length */

import { CollectionNestedOption } from 'devextreme-angular/core';
import {
    Component,
} from '@angular/core';

import DevExpress from 'devextreme/bundles/dx.all';
import { ToolbarItemLocation } from 'devextreme/common';
import { DiagramCommand } from 'devextreme/ui/diagram';

@Component({
    template: ''
})
export abstract class DxiDiagramCustomCommand extends CollectionNestedOption {
    get icon(): string {
        return this._getOption('icon');
    }
    set icon(value: string) {
        this._setOption('icon', value);
    }

    get items(): Array<DevExpress.ui.dxDiagramCustomCommand> {
        return this._getOption('items');
    }
    set items(value: Array<DevExpress.ui.dxDiagramCustomCommand>) {
        this._setOption('items', value);
    }

    get location(): ToolbarItemLocation {
        return this._getOption('location');
    }
    set location(value: ToolbarItemLocation) {
        this._setOption('location', value);
    }

    get name(): DiagramCommand | string {
        return this._getOption('name');
    }
    set name(value: DiagramCommand | string) {
        this._setOption('name', value);
    }

    get text(): string {
        return this._getOption('text');
    }
    set text(value: string) {
        this._setOption('text', value);
    }
}
