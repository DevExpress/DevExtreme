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
    selector: 'dxo-diagram-toolbox',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoDiagramToolboxComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get groups(): Array<Record<string, any>> {
        return this._getOption('groups');
    }
    set groups(value: Array<Record<string, any>>) {
        this._setOption('groups', value);
    }

    @Input()
    get shapeIconsPerRow(): number {
        return this._getOption('shapeIconsPerRow');
    }
    set shapeIconsPerRow(value: number) {
        this._setOption('shapeIconsPerRow', value);
    }

    @Input()
    get showSearch(): boolean {
        return this._getOption('showSearch');
    }
    set showSearch(value: boolean) {
        this._setOption('showSearch', value);
    }

    @Input()
    get visibility(): "auto" | "visible" | "collapsed" | "disabled" {
        return this._getOption('visibility');
    }
    set visibility(value: "auto" | "visible" | "collapsed" | "disabled") {
        this._setOption('visibility', value);
    }

    @Input()
    get width(): number {
        return this._getOption('width');
    }
    set width(value: number) {
        this._setOption('width', value);
    }


    protected get _optionPath() {
        return 'toolbox';
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
    DxoDiagramToolboxComponent
  ],
  exports: [
    DxoDiagramToolboxComponent
  ],
})
export class DxoDiagramToolboxModule { }
