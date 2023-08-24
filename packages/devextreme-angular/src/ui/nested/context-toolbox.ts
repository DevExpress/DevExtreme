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
    selector: 'dxo-context-toolbox',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoContextToolboxComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get category(): string {
        return this._getOption('category');
    }
    set category(value: string) {
        this._setOption('category', value);
    }

    @Input()
    get displayMode(): string {
        return this._getOption('displayMode');
    }
    set displayMode(value: string) {
        this._setOption('displayMode', value);
    }

    @Input()
    get enabled(): boolean {
        return this._getOption('enabled');
    }
    set enabled(value: boolean) {
        this._setOption('enabled', value);
    }

    @Input()
    get shapeIconsPerRow(): number {
        return this._getOption('shapeIconsPerRow');
    }
    set shapeIconsPerRow(value: number) {
        this._setOption('shapeIconsPerRow', value);
    }

    @Input()
    get shapes(): Array<string> {
        return this._getOption('shapes');
    }
    set shapes(value: Array<string>) {
        this._setOption('shapes', value);
    }

    @Input()
    get width(): number {
        return this._getOption('width');
    }
    set width(value: number) {
        this._setOption('width', value);
    }


    protected get _optionPath() {
        return 'contextToolbox';
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
    DxoContextToolboxComponent
  ],
  exports: [
    DxoContextToolboxComponent
  ],
})
export class DxoContextToolboxModule { }
