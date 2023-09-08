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
    selector: 'dxo-pager',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoPagerComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get allowedPageSizes(): string | Array<number | string> {
        return this._getOption('allowedPageSizes');
    }
    set allowedPageSizes(value: string | Array<number | string>) {
        this._setOption('allowedPageSizes', value);
    }

    @Input()
    get displayMode(): string {
        return this._getOption('displayMode');
    }
    set displayMode(value: string) {
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
    get visible(): boolean | string {
        return this._getOption('visible');
    }
    set visible(value: boolean | string) {
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
    DxoPagerComponent
  ],
  exports: [
    DxoPagerComponent
  ],
})
export class DxoPagerModule { }
