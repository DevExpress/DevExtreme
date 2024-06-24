/* tslint:disable:max-line-length */


import {
    Component,
    NgModule,
    Host,
    SkipSelf,
    Input
} from '@angular/core';




import { ShapeCategory, ShapeType, ToolboxDisplayMode } from 'devextreme/ui/diagram';

import {
    NestedOptionHost,
} from 'devextreme-angular/core';
import { CollectionNestedOption } from 'devextreme-angular/core';


@Component({
    selector: 'dxi-group',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxiGroupComponent extends CollectionNestedOption {
    @Input()
    get category(): ShapeCategory | string {
        return this._getOption('category');
    }
    set category(value: ShapeCategory | string) {
        this._setOption('category', value);
    }

    @Input()
    get displayMode(): ToolboxDisplayMode {
        return this._getOption('displayMode');
    }
    set displayMode(value: ToolboxDisplayMode) {
        this._setOption('displayMode', value);
    }

    @Input()
    get expanded(): boolean {
        return this._getOption('expanded');
    }
    set expanded(value: boolean) {
        this._setOption('expanded', value);
    }

    @Input()
    get shapes(): Array<ShapeType | string> {
        return this._getOption('shapes');
    }
    set shapes(value: Array<ShapeType | string>) {
        this._setOption('shapes', value);
    }

    @Input()
    get title(): string {
        return this._getOption('title');
    }
    set title(value: string) {
        this._setOption('title', value);
    }


    protected get _optionPath() {
        return 'groups';
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
    DxiGroupComponent
  ],
  exports: [
    DxiGroupComponent
  ],
})
export class DxiGroupModule { }
