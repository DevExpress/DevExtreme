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
    selector: 'dxo-pivot-grid-field-panel',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoPivotGridFieldPanelComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get allowFieldDragging(): boolean {
        return this._getOption('allowFieldDragging');
    }
    set allowFieldDragging(value: boolean) {
        this._setOption('allowFieldDragging', value);
    }

    @Input()
    get showColumnFields(): boolean {
        return this._getOption('showColumnFields');
    }
    set showColumnFields(value: boolean) {
        this._setOption('showColumnFields', value);
    }

    @Input()
    get showDataFields(): boolean {
        return this._getOption('showDataFields');
    }
    set showDataFields(value: boolean) {
        this._setOption('showDataFields', value);
    }

    @Input()
    get showFilterFields(): boolean {
        return this._getOption('showFilterFields');
    }
    set showFilterFields(value: boolean) {
        this._setOption('showFilterFields', value);
    }

    @Input()
    get showRowFields(): boolean {
        return this._getOption('showRowFields');
    }
    set showRowFields(value: boolean) {
        this._setOption('showRowFields', value);
    }

    @Input()
    get texts(): Record<string, any> {
        return this._getOption('texts');
    }
    set texts(value: Record<string, any>) {
        this._setOption('texts', value);
    }

    @Input()
    get visible(): boolean {
        return this._getOption('visible');
    }
    set visible(value: boolean) {
        this._setOption('visible', value);
    }


    protected get _optionPath() {
        return 'fieldPanel';
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
    DxoPivotGridFieldPanelComponent
  ],
  exports: [
    DxoPivotGridFieldPanelComponent
  ],
})
export class DxoPivotGridFieldPanelModule { }
