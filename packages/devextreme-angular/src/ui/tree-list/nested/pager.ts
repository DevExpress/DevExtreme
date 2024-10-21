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
    selector: 'dxo-tree-list-pager',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoTreeListPagerComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get allowedPageSizes(): Array<number | "all" | "auto"> | "auto" {
        return this._getOption('allowedPageSizes');
    }
    set allowedPageSizes(value: Array<number | "all" | "auto"> | "auto") {
        this._setOption('allowedPageSizes', value);
    }

    @Input()
    get displayMode(): "adaptive" | "compact" | "full" {
        return this._getOption('displayMode');
    }
    set displayMode(value: "adaptive" | "compact" | "full") {
        this._setOption('displayMode', value);
    }

    @Input()
    get infoText(): string {
        return this._getOption('infoText');
    }
    set infoText(value: string) {
        this._setOption('infoText', value);
    }

    @Input()
    get label(): string {
        return this._getOption('label');
    }
    set label(value: string) {
        this._setOption('label', value);
    }

    @Input()
    get showInfo(): boolean {
        return this._getOption('showInfo');
    }
    set showInfo(value: boolean) {
        this._setOption('showInfo', value);
    }

    @Input()
    get showNavigationButtons(): boolean {
        return this._getOption('showNavigationButtons');
    }
    set showNavigationButtons(value: boolean) {
        this._setOption('showNavigationButtons', value);
    }

    @Input()
    get showPageSizeSelector(): boolean {
        return this._getOption('showPageSizeSelector');
    }
    set showPageSizeSelector(value: boolean) {
        this._setOption('showPageSizeSelector', value);
    }

    @Input()
    get visible(): boolean | "auto" {
        return this._getOption('visible');
    }
    set visible(value: boolean | "auto") {
        this._setOption('visible', value);
    }


    protected get _optionPath() {
        return 'pager';
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
    DxoTreeListPagerComponent
  ],
  exports: [
    DxoTreeListPagerComponent
  ],
})
export class DxoTreeListPagerModule { }
