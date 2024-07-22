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
    EventEmitter,
    ContentChildren,
    forwardRef,
    QueryList
} from '@angular/core';





import {
    NestedOptionHost,
} from 'devextreme-angular/core';
import { NestedOption } from 'devextreme-angular/core';
import { DxiItemDiagramComponent } from './item-dxi';


@Component({
    selector: 'dxo-page-size-diagram',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoPageSizeDiagramComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get height(): number {
        return this._getOption('height');
    }
    set height(value: number) {
        this._setOption('height', value);
    }

    @Input()
    get items(): Array<any | { height?: number, text?: string, width?: number }> {
        return this._getOption('items');
    }
    set items(value: Array<any | { height?: number, text?: string, width?: number }>) {
        this._setOption('items', value);
    }

    @Input()
    get width(): number {
        return this._getOption('width');
    }
    set width(value: number) {
        this._setOption('width', value);
    }


    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() heightChange: EventEmitter<number>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() widthChange: EventEmitter<number>;
    protected get _optionPath() {
        return 'pageSize';
    }


    @ContentChildren(forwardRef(() => DxiItemDiagramComponent))
    get itemsChildren(): QueryList<DxiItemDiagramComponent> {
        return this._getOption('items');
    }
    set itemsChildren(value) {
        this.setChildren('items', value);
    }

    constructor(@SkipSelf() @Host() parentOptionHost: NestedOptionHost,
            @Host() optionHost: NestedOptionHost) {
        super();

        this._createEventEmitters([
            { emit: 'heightChange' },
            { emit: 'widthChange' }
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
    DxoPageSizeDiagramComponent
  ],
  exports: [
    DxoPageSizeDiagramComponent
  ],
})
export class DxoPageSizeDiagramModule { }
