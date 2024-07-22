/* tslint:disable:max-line-length */


import {
    Component,
    OnInit,
    OnDestroy,
    NgModule,
    Host,
    SkipSelf,
    Input
} from '@angular/core';





import {
    NestedOptionHost,
} from 'devextreme-angular/core';
import { NestedOption } from 'devextreme-angular/core';


@Component({
    selector: 'dxo-group-operation-descriptions-data-grid',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoGroupOperationDescriptionsDataGridComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get and(): string {
        return this._getOption('and');
    }
    set and(value: string) {
        this._setOption('and', value);
    }

    @Input()
    get notAnd(): string {
        return this._getOption('notAnd');
    }
    set notAnd(value: string) {
        this._setOption('notAnd', value);
    }

    @Input()
    get notOr(): string {
        return this._getOption('notOr');
    }
    set notOr(value: string) {
        this._setOption('notOr', value);
    }

    @Input()
    get or(): string {
        return this._getOption('or');
    }
    set or(value: string) {
        this._setOption('or', value);
    }


    protected get _optionPath() {
        return 'groupOperationDescriptions';
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
    DxoGroupOperationDescriptionsDataGridComponent
  ],
  exports: [
    DxoGroupOperationDescriptionsDataGridComponent
  ],
})
export class DxoGroupOperationDescriptionsDataGridModule { }
