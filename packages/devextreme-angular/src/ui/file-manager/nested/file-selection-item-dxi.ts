/* tslint:disable:max-line-length */


import {
    Component,
    NgModule,
    Host,
    SkipSelf,
    Input
} from '@angular/core';




import { LocateInMenuMode, ShowTextMode } from 'devextreme/ui/toolbar';
import { ToolbarItemLocation, ToolbarItemComponent } from 'devextreme/common';
import { FileManagerPredefinedToolbarItem } from 'devextreme/ui/file_manager';

import {
    NestedOptionHost,
} from 'devextreme-angular/core';
import { CollectionNestedOption } from 'devextreme-angular/core';


@Component({
    selector: 'dxi-file-manager-file-selection-item',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxiFileManagerFileSelectionItemComponent extends CollectionNestedOption {
    @Input()
    get cssClass(): string | undefined {
        return this._getOption('cssClass');
    }
    set cssClass(value: string | undefined) {
        this._setOption('cssClass', value);
    }

    @Input()
    get disabled(): boolean {
        return this._getOption('disabled');
    }
    set disabled(value: boolean) {
        this._setOption('disabled', value);
    }

    @Input()
    get icon(): string {
        return this._getOption('icon');
    }
    set icon(value: string) {
        this._setOption('icon', value);
    }

    @Input()
    get locateInMenu(): LocateInMenuMode {
        return this._getOption('locateInMenu');
    }
    set locateInMenu(value: LocateInMenuMode) {
        this._setOption('locateInMenu', value);
    }

    @Input()
    get location(): ToolbarItemLocation {
        return this._getOption('location');
    }
    set location(value: ToolbarItemLocation) {
        this._setOption('location', value);
    }

    @Input()
    get name(): FileManagerPredefinedToolbarItem | string {
        return this._getOption('name');
    }
    set name(value: FileManagerPredefinedToolbarItem | string) {
        this._setOption('name', value);
    }

    @Input()
    get options(): any {
        return this._getOption('options');
    }
    set options(value: any) {
        this._setOption('options', value);
    }

    @Input()
    get showText(): ShowTextMode {
        return this._getOption('showText');
    }
    set showText(value: ShowTextMode) {
        this._setOption('showText', value);
    }

    @Input()
    get text(): string {
        return this._getOption('text');
    }
    set text(value: string) {
        this._setOption('text', value);
    }

    @Input()
    get visible(): boolean | undefined {
        return this._getOption('visible');
    }
    set visible(value: boolean | undefined) {
        this._setOption('visible', value);
    }

    @Input()
    get widget(): ToolbarItemComponent {
        return this._getOption('widget');
    }
    set widget(value: ToolbarItemComponent) {
        this._setOption('widget', value);
    }


    protected get _optionPath() {
        return 'fileSelectionItems';
    }


    constructor(@SkipSelf() @Host() parentOptionHost: NestedOptionHost,
            @Host() optionHost: NestedOptionHost) {
        super();
        parentOptionHost.setNestedOption(this);
        optionHost.setHost(this, this._fullOptionPath.bind(this));
    }



    ngOnDestroy() {
        this._deleteRemovedOptions(this._fullOptionPath());
    }

}

@NgModule({
  declarations: [
    DxiFileManagerFileSelectionItemComponent
  ],
  exports: [
    DxiFileManagerFileSelectionItemComponent
  ],
})
export class DxiFileManagerFileSelectionItemModule { }
