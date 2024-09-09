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
    selector: 'dxo-diagram-export',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoDiagramExportComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get fileName(): string {
        return this._getOption('fileName');
    }
    set fileName(value: string) {
        this._setOption('fileName', value);
    }


    protected get _optionPath() {
        return 'export';
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
    DxoDiagramExportComponent
  ],
  exports: [
    DxoDiagramExportComponent
  ],
})
export class DxoDiagramExportModule { }
