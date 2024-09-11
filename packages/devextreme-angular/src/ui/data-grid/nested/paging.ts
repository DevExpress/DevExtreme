/* tslint:disable:max-line-length */


import {
    Component,
    OnInit,
    OnDestroy,
    NgModule,
    Host,
    SkipSelf,
    Input,
    Output,
    EventEmitter
} from '@angular/core';





import {
    NestedOptionHost,
} from 'devextreme-angular/core';
import { NestedOption } from 'devextreme-angular/core';


@Component({
    selector: 'dxo-data-grid-paging',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoDataGridPagingComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get enabled(): boolean {
        return this._getOption('enabled');
    }
    set enabled(value: boolean) {
        this._setOption('enabled', value);
    }

    @Input()
    get pageIndex(): number {
        return this._getOption('pageIndex');
    }
    set pageIndex(value: number) {
        this._setOption('pageIndex', value);
    }

    @Input()
    get pageSize(): number {
        return this._getOption('pageSize');
    }
    set pageSize(value: number) {
        this._setOption('pageSize', value);
    }


    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() pageIndexChange: EventEmitter<number>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() pageSizeChange: EventEmitter<number>;
    protected get _optionPath() {
        return 'paging';
    }


    constructor(@SkipSelf() @Host() parentOptionHost: NestedOptionHost,
            @Host() optionHost: NestedOptionHost) {
        super();

        this._createEventEmitters([
            { emit: 'pageIndexChange' },
            { emit: 'pageSizeChange' }
        ]);

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
    DxoDataGridPagingComponent
  ],
  exports: [
    DxoDataGridPagingComponent
  ],
})
export class DxoDataGridPagingModule { }
