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
    selector: 'dxo-card-view-card-cover',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoCardViewCardCoverComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get altExpr(): ((data: any) => string) | string {
        return this._getOption('altExpr');
    }
    set altExpr(value: ((data: any) => string) | string) {
        this._setOption('altExpr', value);
    }

    @Input()
    get aspectRatio(): string {
        return this._getOption('aspectRatio');
    }
    set aspectRatio(value: string) {
        this._setOption('aspectRatio', value);
    }

    @Input()
    get imageExpr(): ((data: any) => string) | string {
        return this._getOption('imageExpr');
    }
    set imageExpr(value: ((data: any) => string) | string) {
        this._setOption('imageExpr', value);
    }

    @Input()
    get maxHeight(): number {
        return this._getOption('maxHeight');
    }
    set maxHeight(value: number) {
        this._setOption('maxHeight', value);
    }


    protected get _optionPath() {
        return 'cardCover';
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
    DxoCardViewCardCoverComponent
  ],
  exports: [
    DxoCardViewCardCoverComponent
  ],
})
export class DxoCardViewCardCoverModule { }
