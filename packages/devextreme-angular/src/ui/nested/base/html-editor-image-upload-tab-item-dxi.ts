/* tslint:disable:max-line-length */

import { CollectionNestedOption } from 'devextreme-angular/core';
import {
    Component,
} from '@angular/core';

import { Command, CustomCommand } from 'devextreme/ui/diagram';
import { ButtonItem, EmptyItem, GroupItem, SimpleItem, TabbedItem } from 'devextreme/ui/form';
import { HtmlEditorImageUploadTab } from 'devextreme/ui/html_editor';

@Component({
    template: ''
})
export abstract class DxiHtmlEditorImageUploadTabItem extends CollectionNestedOption {
    get alignItemLabels(): boolean {
        return this._getOption('alignItemLabels');
    }
    set alignItemLabels(value: boolean) {
        this._setOption('alignItemLabels', value);
    }

    get badge(): string | undefined {
        return this._getOption('badge');
    }
    set badge(value: string | undefined) {
        this._setOption('badge', value);
    }

    get colCount(): number {
        return this._getOption('colCount');
    }
    set colCount(value: number) {
        this._setOption('colCount', value);
    }

    get colCountByScreen(): { lg?: number | undefined, md?: number | undefined, sm?: number | undefined, xs?: number | undefined } {
        return this._getOption('colCountByScreen');
    }
    set colCountByScreen(value: { lg?: number | undefined, md?: number | undefined, sm?: number | undefined, xs?: number | undefined }) {
        this._setOption('colCountByScreen', value);
    }

    get disabled(): boolean {
        return this._getOption('disabled');
    }
    set disabled(value: boolean) {
        this._setOption('disabled', value);
    }

    get icon(): string | undefined {
        return this._getOption('icon');
    }
    set icon(value: string | undefined) {
        this._setOption('icon', value);
    }

    get items(): Array<SimpleItem | GroupItem | TabbedItem | EmptyItem | ButtonItem> {
        return this._getOption('items');
    }
    set items(value: Array<SimpleItem | GroupItem | TabbedItem | EmptyItem | ButtonItem>) {
        this._setOption('items', value);
    }

    get tabTemplate(): any | undefined {
        return this._getOption('tabTemplate');
    }
    set tabTemplate(value: any | undefined) {
        this._setOption('tabTemplate', value);
    }

    get template(): any | undefined {
        return this._getOption('template');
    }
    set template(value: any | undefined) {
        this._setOption('template', value);
    }

    get title(): string | undefined {
        return this._getOption('title');
    }
    set title(value: string | undefined) {
        this._setOption('title', value);
    }

    get commands(): Array<CustomCommand | Command> {
        return this._getOption('commands');
    }
    set commands(value: Array<CustomCommand | Command>) {
        this._setOption('commands', value);
    }

    get groups(): Array<any | { commands?: Array<CustomCommand | Command>, title?: string }> {
        return this._getOption('groups');
    }
    set groups(value: Array<any | { commands?: Array<CustomCommand | Command>, title?: string }>) {
        this._setOption('groups', value);
    }

    get name(): HtmlEditorImageUploadTab | undefined {
        return this._getOption('name');
    }
    set name(value: HtmlEditorImageUploadTab | undefined) {
        this._setOption('name', value);
    }
}
