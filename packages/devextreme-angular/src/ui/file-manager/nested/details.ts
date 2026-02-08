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
    QueryList
} from '@angular/core';




import { dxFileManagerDetailsColumn } from 'devextreme/ui/file_manager';

import {
    DxIntegrationModule,
    NestedOptionHost,
    CollectionNestedOption,
} from 'devextreme-angular/core';
import { NestedOption } from 'devextreme-angular/core';

import {
    PROPERTY_TOKEN_columns,
} from 'devextreme-angular/core/tokens';

@Component({
    selector: 'dxo-file-manager-details',
    standalone: true,
    template: '',
    styles: [''],
    imports: [ DxIntegrationModule ],
    providers: [NestedOptionHost]
})
export class DxoFileManagerDetailsComponent extends NestedOption implements OnDestroy, OnInit  {
    @ContentChildren(PROPERTY_TOKEN_columns)
    set _columnsContentChildren(value: QueryList<CollectionNestedOption>) {
        this.setChildren('columns', value);
    }
    
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
  imports: [
    DxoFileManagerDetailsComponent
  ],
  exports: [
    DxoFileManagerDetailsComponent
  ],
})
export class DxoFileManagerDetailsModule { }
