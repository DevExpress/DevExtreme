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
    selector: 'dxo-card-view-card-header',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoCardViewCardHeaderComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get captionExpr(): ((data: any) => string) | string {
        return this._getOption('captionExpr');
    }
    set captionExpr(value: ((data: any) => string) | string) {
        this._setOption('captionExpr', value);
    }

    @Input()
    get visible(): boolean {
        return this._getOption('visible');
    }
    set visible(value: boolean) {
        this._setOption('visible', value);
    }


    protected get _optionPath() {
        return 'cardHeader';
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
    DxoCardViewCardHeaderComponent
  ],
  exports: [
    DxoCardViewCardHeaderComponent
  ],
})
export class DxoCardViewCardHeaderModule { }
