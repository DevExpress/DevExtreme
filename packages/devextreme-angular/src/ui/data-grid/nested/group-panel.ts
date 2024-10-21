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
    selector: 'dxo-data-grid-group-panel',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoDataGridGroupPanelComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get allowColumnDragging(): boolean {
        return this._getOption('allowColumnDragging');
    }
    set allowColumnDragging(value: boolean) {
        this._setOption('allowColumnDragging', value);
    }

    @Input()
    get emptyPanelText(): string {
        return this._getOption('emptyPanelText');
    }
    set emptyPanelText(value: string) {
        this._setOption('emptyPanelText', value);
    }

    @Input()
    get visible(): boolean | "auto" {
        return this._getOption('visible');
    }
    set visible(value: boolean | "auto") {
        this._setOption('visible', value);
    }


    protected get _optionPath() {
        return 'groupPanel';
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
    DxoDataGridGroupPanelComponent
  ],
  exports: [
    DxoDataGridGroupPanelComponent
  ],
})
export class DxoDataGridGroupPanelModule { }
