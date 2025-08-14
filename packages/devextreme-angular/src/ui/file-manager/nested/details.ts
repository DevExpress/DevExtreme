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
    QueryList,
} from '@angular/core';




import { dxFileManagerDetailsColumn } from 'devextreme/ui/file_manager';

import {
    DxIntegrationModule,
    NestedOptionHost,
    CollectionNestedOption,
    СOLLECTION_NESTED_OPTION_TOKEN,
} from 'devextreme-angular/core';
import { NestedOption } from 'devextreme-angular/core';

@Component({
    selector: 'dxo-file-manager-details',
    standalone: true,
    template: '',
    styles: [''],
    imports: [ DxIntegrationModule ],
    providers: [
        NestedOptionHost,
    ],
})
export class DxoFileManagerDetailsComponent extends NestedOption implements OnDestroy, OnInit {

    @ContentChildren(СOLLECTION_NESTED_OPTION_TOKEN)
    set _CollectionOptionChildren(value: QueryList<{ propertyName: string, component: CollectionNestedOption }>) {
        this._setChildren(value);
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
