/* tslint:disable:max-line-length */


import {
    Component,
    NgModule,
    Host,
    SkipSelf,
    Input
} from '@angular/core';





import {
    NestedOptionHost,
} from 'devextreme-angular/core';
import { CollectionNestedOption } from 'devextreme-angular/core';


@Component({
    selector: 'dxi-data-grid-change',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxiDataGridChangeComponent extends CollectionNestedOption {
    @Input()
    get data(): any {
        return this._getOption('data');
    }
    set data(value: any) {
        this._setOption('data', value);
    }

    @Input()
    get insertAfterKey(): any {
        return this._getOption('insertAfterKey');
    }
    set insertAfterKey(value: any) {
        this._setOption('insertAfterKey', value);
    }

    @Input()
    get insertBeforeKey(): any {
        return this._getOption('insertBeforeKey');
    }
    set insertBeforeKey(value: any) {
        this._setOption('insertBeforeKey', value);
    }

    @Input()
    get key(): any {
        return this._getOption('key');
    }
    set key(value: any) {
        this._setOption('key', value);
    }

    @Input()
    get type(): "insert" | "update" | "remove" {
        return this._getOption('type');
    }
    set type(value: "insert" | "update" | "remove") {
        this._setOption('type', value);
    }


    protected get _optionPath() {
        return 'changes';
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
    DxiDataGridChangeComponent
  ],
  exports: [
    DxiDataGridChangeComponent
  ],
})
export class DxiDataGridChangeModule { }
