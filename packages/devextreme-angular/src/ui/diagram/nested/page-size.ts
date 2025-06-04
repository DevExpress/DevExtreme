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
    QueryList,
    AfterContentInit
} from '@angular/core';





import {
    DxIntegrationModule,
    NestedOptionHost,
} from 'devextreme-angular/core';
import { NestedOption } from 'devextreme-angular/core';
import { DxiDiagramItemComponent } from './item-dxi';
import { DxiDiagramPageSizeItemComponent } from './page-size-item-dxi';


@Component({
    selector: 'dxo-diagram-page-size',
    standalone: true,
    template: '',
    styles: [''],
    imports: [ DxIntegrationModule ],
    providers: [NestedOptionHost]
})
export class DxoDiagramPageSizeComponent extends NestedOption implements OnDestroy, OnInit, AfterContentInit   {
    @Input()
    get height(): number {
        return this._getOption('height');
    }
    set height(value: number) {
        this._setOption('height', value);
    }

    @Input()
    get items(): { height?: number, text?: string, width?: number }[] {
        return this._getOption('items');
    }
    set items(value: { height?: number, text?: string, width?: number }[]) {
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


    @ContentChildren(forwardRef(() => DxiDiagramItemComponent)) itemsChildren!: QueryList<DxiDiagramItemComponent>
    
    @ContentChildren(forwardRef(() => DxiDiagramPageSizeItemComponent)) pageSizeItemsChildren!: QueryList<DxiDiagramPageSizeItemComponent>
    
    setItems() {
        const q: QueryList<any> = new QueryList();
        q.reset([...this.itemsChildren.toArray(),...this.pageSizeItemsChildren.toArray(),]);
        this.setChildren('items', q);
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


    ngAfterContentInit() {
        this.setItems();
        
        this.itemsChildren.changes.subscribe(() => { this.setItems() });
        this.pageSizeItemsChildren.changes.subscribe(() => { this.setItems() });
    }
}

@NgModule({
  imports: [
    DxoDiagramPageSizeComponent
  ],
  exports: [
    DxoDiagramPageSizeComponent
  ],
})
export class DxoDiagramPageSizeModule { }
