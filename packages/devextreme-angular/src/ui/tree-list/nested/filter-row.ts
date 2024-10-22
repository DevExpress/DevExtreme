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
    selector: 'dxo-tree-list-filter-row',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoTreeListFilterRowComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get applyFilter(): "auto" | "onClick" {
        return this._getOption('applyFilter');
    }
    set applyFilter(value: "auto" | "onClick") {
        this._setOption('applyFilter', value);
    }

    @Input()
    get applyFilterText(): string {
        return this._getOption('applyFilterText');
    }
    set applyFilterText(value: string) {
        this._setOption('applyFilterText', value);
    }

    @Input()
    get betweenEndText(): string {
        return this._getOption('betweenEndText');
    }
    set betweenEndText(value: string) {
        this._setOption('betweenEndText', value);
    }

    @Input()
    get betweenStartText(): string {
        return this._getOption('betweenStartText');
    }
    set betweenStartText(value: string) {
        this._setOption('betweenStartText', value);
    }

    @Input()
    get operationDescriptions(): Record<string, any> | { between: string, contains: string, endsWith: string, equal: string, greaterThan: string, greaterThanOrEqual: string, lessThan: string, lessThanOrEqual: string, notContains: string, notEqual: string, startsWith: string } {
        return this._getOption('operationDescriptions');
    }
    set operationDescriptions(value: Record<string, any> | { between: string, contains: string, endsWith: string, equal: string, greaterThan: string, greaterThanOrEqual: string, lessThan: string, lessThanOrEqual: string, notContains: string, notEqual: string, startsWith: string }) {
        this._setOption('operationDescriptions', value);
    }

    @Input()
    get resetOperationText(): string {
        return this._getOption('resetOperationText');
    }
    set resetOperationText(value: string) {
        this._setOption('resetOperationText', value);
    }

    @Input()
    get showAllText(): string {
        return this._getOption('showAllText');
    }
    set showAllText(value: string) {
        this._setOption('showAllText', value);
    }

    @Input()
    get showOperationChooser(): boolean {
        return this._getOption('showOperationChooser');
    }
    set showOperationChooser(value: boolean) {
        this._setOption('showOperationChooser', value);
    }

    @Input()
    get visible(): boolean {
        return this._getOption('visible');
    }
    set visible(value: boolean) {
        this._setOption('visible', value);
    }


    protected get _optionPath() {
        return 'filterRow';
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
    DxoTreeListFilterRowComponent
  ],
  exports: [
    DxoTreeListFilterRowComponent
  ],
})
export class DxoTreeListFilterRowModule { }
