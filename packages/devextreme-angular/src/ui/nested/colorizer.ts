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
    selector: 'dxo-colorizer',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoColorizerComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get colorCodeField(): string | undefined {
        return this._getOption('colorCodeField');
    }
    set colorCodeField(value: string | undefined) {
        this._setOption('colorCodeField', value);
    }

    @Input()
    get colorizeGroups(): boolean {
        return this._getOption('colorizeGroups');
    }
    set colorizeGroups(value: boolean) {
        this._setOption('colorizeGroups', value);
    }

    @Input()
    get palette(): string | Array<string> {
        return this._getOption('palette');
    }
    set palette(value: string | Array<string>) {
        this._setOption('palette', value);
    }

    @Input()
    get paletteExtensionMode(): string {
        return this._getOption('paletteExtensionMode');
    }
    set paletteExtensionMode(value: string) {
        this._setOption('paletteExtensionMode', value);
    }

    @Input()
    get range(): Array<number> {
        return this._getOption('range');
    }
    set range(value: Array<number>) {
        this._setOption('range', value);
    }

    @Input()
    get type(): string | undefined {
        return this._getOption('type');
    }
    set type(value: string | undefined) {
        this._setOption('type', value);
    }


    protected get _optionPath() {
        return 'colorizer';
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
    DxoColorizerComponent
  ],
  exports: [
    DxoColorizerComponent
  ],
})
export class DxoColorizerModule { }
