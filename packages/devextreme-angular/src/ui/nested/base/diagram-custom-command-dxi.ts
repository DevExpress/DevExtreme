/* tslint:disable:max-line-length */

import { CollectionNestedOption } from 'devextreme-angular/core';
import {
    Component,
} from '@angular/core';

import type { ToolbarItemLocation } from 'devextreme/common';
import type { Command, CustomCommand } from 'devextreme/ui/diagram';
import type { AICommandNameExtended } from 'devextreme/ui/html_editor';

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

    get items(): Array<CustomCommand | Command> {
        return this._getOption('items');
    }
    set items(value: Array<CustomCommand | Command>) {
        this._setOption('items', value);
    }

    get location(): ToolbarItemLocation {
        return this._getOption('location');
    }
    set location(value: ToolbarItemLocation) {
        this._setOption('location', value);
    }

    get name(): Command | string | AICommandNameExtended {
        return this._getOption('name');
    }
    set name(value: Command | string | AICommandNameExtended) {
        this._setOption('name', value);
    }

    get text(): string {
        return this._getOption('text');
    }
    set text(value: string) {
        this._setOption('text', value);
    }

    get options(): any {
        return this._getOption('options');
    }
    set options(value: any) {
        this._setOption('options', value);
    }

    get prompt(): Function {
        return this._getOption('prompt');
    }
    set prompt(value: Function) {
        this._setOption('prompt', value);
    }
}
