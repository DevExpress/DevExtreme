/* tslint:disable:max-line-length */


import {
    Component,
    OnInit,
    OnDestroy,
    NgModule,
    Host,
    SkipSelf,
    Input,
    Output,
    EventEmitter
} from '@angular/core';





import {
    NestedOptionHost,
} from 'devextreme-angular/core';
import { NestedOption } from 'devextreme-angular/core';


@Component({
    selector: 'dxo-filter-panel-data-grid',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoFilterPanelDataGridComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get customizeText(): Function {
        return this._getOption('customizeText');
    }
    set customizeText(value: Function) {
        this._setOption('customizeText', value);
    }

    @Input()
    get filterEnabled(): boolean {
        return this._getOption('filterEnabled');
    }
    set filterEnabled(value: boolean) {
        this._setOption('filterEnabled', value);
    }

    @Input()
    get texts(): { clearFilter?: string, createFilter?: string, filterEnabledHint?: string } {
        return this._getOption('texts');
    }
    set texts(value: { clearFilter?: string, createFilter?: string, filterEnabledHint?: string }) {
        this._setOption('texts', value);
    }

    @Input()
    get visible(): boolean {
        return this._getOption('visible');
    }
    set visible(value: boolean) {
        this._setOption('visible', value);
    }


    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() filterEnabledChange: EventEmitter<boolean>;
    protected get _optionPath() {
        return 'filterPanel';
    }


    constructor(@SkipSelf() @Host() parentOptionHost: NestedOptionHost,
            @Host() optionHost: NestedOptionHost) {
        super();

        this._createEventEmitters([
            { emit: 'filterEnabledChange' }
        ]);

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
    DxoFilterPanelDataGridComponent
  ],
  exports: [
    DxoFilterPanelDataGridComponent
  ],
})
export class DxoFilterPanelDataGridModule { }
