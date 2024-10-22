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
    selector: 'dxo-funnel-item',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoFunnelItemComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get border(): Record<string, any> | { color: string, visible: boolean, width: number } {
        return this._getOption('border');
    }
    set border(value: Record<string, any> | { color: string, visible: boolean, width: number }) {
        this._setOption('border', value);
    }

    @Input()
    get hoverStyle(): Record<string, any> | { border: Record<string, any>, hatching: Record<string, any> } {
        return this._getOption('hoverStyle');
    }
    set hoverStyle(value: Record<string, any> | { border: Record<string, any>, hatching: Record<string, any> }) {
        this._setOption('hoverStyle', value);
    }

    @Input()
    get selectionStyle(): Record<string, any> | { border: Record<string, any>, hatching: Record<string, any> } {
        return this._getOption('selectionStyle');
    }
    set selectionStyle(value: Record<string, any> | { border: Record<string, any>, hatching: Record<string, any> }) {
        this._setOption('selectionStyle', value);
    }


    protected get _optionPath() {
        return 'item';
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
    DxoFunnelItemComponent
  ],
  exports: [
    DxoFunnelItemComponent
  ],
})
export class DxoFunnelItemModule { }
