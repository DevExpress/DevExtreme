/* tslint:disable:max-line-length */


import {
    Component,
    OnInit,
    OnDestroy,
    NgModule,
    Host,
    SkipSelf,
    Input,
    ContentChildren,
    forwardRef,
    QueryList
} from '@angular/core';




import { dxFileManagerDetailsColumn } from 'devextreme/ui/file_manager';

import {
    NestedOptionHost,
} from 'devextreme-angular/core';
import { NestedOption } from 'devextreme-angular/core';
import { DxiFileManagerColumnComponent } from './column-dxi';


@Component({
    selector: 'dxo-file-manager-details',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoFileManagerDetailsComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get columns(): Array<dxFileManagerDetailsColumn | string> {
        return this._getOption('columns');
    }
    set columns(value: Array<dxFileManagerDetailsColumn | string>) {
        this._setOption('columns', value);
    }


    protected get _optionPath() {
        return 'details';
    }


    @ContentChildren(forwardRef(() => DxiFileManagerColumnComponent))
    get columnsChildren(): QueryList<DxiFileManagerColumnComponent> {
        return this._getOption('columns');
    }
    set columnsChildren(value) {
        this.setChildren('columns', value);
    }

    constructor(@SkipSelf() @Host() parentOptionHost: NestedOptionHost,
            @Host() optionHost: NestedOptionHost) {
        super();
        parentOptionHost.setNestedOption(this);
        optionHost.setHost(this, this._fullOptionPath.bind(this));
    }


    ngOnInit() {
        this._addRecreatedComponent();
    }

    ngOnDestroy() {
        this._addRemovedOption(this._getOptionPath());
    }


}

@NgModule({
  declarations: [
    DxoFileManagerDetailsComponent
  ],
  exports: [
    DxoFileManagerDetailsComponent
  ],
})
export class DxoFileManagerDetailsModule { }
