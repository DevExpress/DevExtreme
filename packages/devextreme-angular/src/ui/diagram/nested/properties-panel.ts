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
    selector: 'dxo-diagram-properties-panel',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoDiagramPropertiesPanelComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get tabs(): Array<Record<string, any>> {
        return this._getOption('tabs');
    }
    set tabs(value: Array<Record<string, any>>) {
        this._setOption('tabs', value);
    }

    @Input()
    get visibility(): "auto" | "visible" | "collapsed" | "disabled" {
        return this._getOption('visibility');
    }
    set visibility(value: "auto" | "visible" | "collapsed" | "disabled") {
        this._setOption('visibility', value);
    }


    protected get _optionPath() {
        return 'propertiesPanel';
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
    DxoDiagramPropertiesPanelComponent
  ],
  exports: [
    DxoDiagramPropertiesPanelComponent
  ],
})
export class DxoDiagramPropertiesPanelModule { }
