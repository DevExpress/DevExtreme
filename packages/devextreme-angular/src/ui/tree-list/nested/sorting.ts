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
    selector: 'dxo-tree-list-sorting',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoTreeListSortingComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get ascendingText(): string {
        return this._getOption('ascendingText');
    }
    set ascendingText(value: string) {
        this._setOption('ascendingText', value);
    }

    @Input()
    get clearText(): string {
        return this._getOption('clearText');
    }
    set clearText(value: string) {
        this._setOption('clearText', value);
    }

    @Input()
    get descendingText(): string {
        return this._getOption('descendingText');
    }
    set descendingText(value: string) {
        this._setOption('descendingText', value);
    }

    @Input()
    get mode(): "single" | "multiple" | "none" {
        return this._getOption('mode');
    }
    set mode(value: "single" | "multiple" | "none") {
        this._setOption('mode', value);
    }

    @Input()
    get showSortIndexes(): boolean {
        return this._getOption('showSortIndexes');
    }
    set showSortIndexes(value: boolean) {
        this._setOption('showSortIndexes', value);
    }


    protected get _optionPath() {
        return 'sorting';
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
    DxoTreeListSortingComponent
  ],
  exports: [
    DxoTreeListSortingComponent
  ],
})
export class DxoTreeListSortingModule { }
