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
    selector: 'dxo-texts',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoTextsComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get avg(): string {
        return this._getOption('avg');
    }
    set avg(value: string) {
        this._setOption('avg', value);
    }

    @Input()
    get avgOtherColumn(): string {
        return this._getOption('avgOtherColumn');
    }
    set avgOtherColumn(value: string) {
        this._setOption('avgOtherColumn', value);
    }

    @Input()
    get count(): string {
        return this._getOption('count');
    }
    set count(value: string) {
        this._setOption('count', value);
    }

    @Input()
    get max(): string {
        return this._getOption('max');
    }
    set max(value: string) {
        this._setOption('max', value);
    }

    @Input()
    get maxOtherColumn(): string {
        return this._getOption('maxOtherColumn');
    }
    set maxOtherColumn(value: string) {
        this._setOption('maxOtherColumn', value);
    }

    @Input()
    get min(): string {
        return this._getOption('min');
    }
    set min(value: string) {
        this._setOption('min', value);
    }

    @Input()
    get minOtherColumn(): string {
        return this._getOption('minOtherColumn');
    }
    set minOtherColumn(value: string) {
        this._setOption('minOtherColumn', value);
    }

    @Input()
    get sum(): string {
        return this._getOption('sum');
    }
    set sum(value: string) {
        this._setOption('sum', value);
    }

    @Input()
    get sumOtherColumn(): string {
        return this._getOption('sumOtherColumn');
    }
    set sumOtherColumn(value: string) {
        this._setOption('sumOtherColumn', value);
    }


    protected get _optionPath() {
        return 'texts';
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
    DxoTextsComponent
  ],
  exports: [
    DxoTextsComponent
  ],
})
export class DxoTextsModule { }
