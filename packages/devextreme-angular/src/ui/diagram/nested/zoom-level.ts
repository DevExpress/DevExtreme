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
    selector: 'dxo-zoom-level',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoZoomLevelComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get items(): Array<number> {
        return this._getOption('items');
    }
    set items(value: Array<number>) {
        this._setOption('items', value);
    }

    @Input()
    get value(): number | undefined {
        return this._getOption('value');
    }
    set value(value: number | undefined) {
        this._setOption('value', value);
    }


    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() valueChange: EventEmitter<number | undefined>;
    protected get _optionPath() {
        return 'zoomLevel';
    }


    constructor(@SkipSelf() @Host() parentOptionHost: NestedOptionHost,
            @Host() optionHost: NestedOptionHost) {
        super();

        this._createEventEmitters([
            { emit: 'valueChange' }
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
    DxoZoomLevelComponent
  ],
  exports: [
    DxoZoomLevelComponent
  ],
})
export class DxoZoomLevelModule { }
