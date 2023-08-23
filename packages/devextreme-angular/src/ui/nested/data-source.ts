/* tslint:disable:max-line-length */

/* tslint:disable:use-input-property-decorator */

import {
    Component,
    OnInit,
    OnDestroy,
    NgModule,
    Host,
    SkipSelf,
    ContentChildren,
    forwardRef,
    QueryList
} from '@angular/core';





import {
    NestedOptionHost,
} from 'devextreme-angular/core';
import { DxoPivotGridDataSource } from './base/pivot-grid-data-source';
import { DxiFieldComponent } from './field-dxi';


@Component({
    selector: 'dxo-data-source',
    template: '',
    styles: [''],
    providers: [NestedOptionHost],
    inputs: [
        'fields',
        'filter',
        'onChanged',
        'onFieldsPrepared',
        'onLoadError',
        'onLoadingChanged',
        'remoteOperations',
        'retrieveFields',
        'store'
    ]
})
export class DxoDataSourceComponent extends DxoPivotGridDataSource implements OnDestroy, OnInit  {

    protected get _optionPath() {
        return 'dataSource';
    }


    @ContentChildren(forwardRef(() => DxiFieldComponent))
    get fieldsChildren(): QueryList<DxiFieldComponent> {
        return this._getOption('fields');
    }
    set fieldsChildren(value) {
        this.setChildren('fields', value);
    }

    constructor(@SkipSelf() @Host() parentOptionHost: NestedOptionHost,
            @Host() optionHost: NestedOptionHost) {
        super();
        parentOptionHost.setNestedOption(this);
        optionHost.setHost(this, this._fullOptionPath.bind(this));
        if ((console) && (console.warn)) {
            console.warn('The nested \'dxo-data-source\' component is deprecated in 17.2. ' +
                'Use the \'dataSource\' option instead. ' +
                'See:\nhttps://github.com/DevExpress/devextreme-angular/blob/master/CHANGELOG.md#17.2.3'
            );
        }
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
    DxoDataSourceComponent
  ],
  exports: [
    DxoDataSourceComponent
  ],
})
export class DxoDataSourceModule { }
