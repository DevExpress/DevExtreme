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
    selector: 'dxo-search-panel',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoSearchPanelComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get highlightCaseSensitive(): boolean {
        return this._getOption('highlightCaseSensitive');
    }
    set highlightCaseSensitive(value: boolean) {
        this._setOption('highlightCaseSensitive', value);
    }

    @Input()
    get highlightSearchText(): boolean {
        return this._getOption('highlightSearchText');
    }
    set highlightSearchText(value: boolean) {
        this._setOption('highlightSearchText', value);
    }

    @Input()
    get placeholder(): string {
        return this._getOption('placeholder');
    }
    set placeholder(value: string) {
        this._setOption('placeholder', value);
    }

    @Input()
    get searchVisibleColumnsOnly(): boolean {
        return this._getOption('searchVisibleColumnsOnly');
    }
    set searchVisibleColumnsOnly(value: boolean) {
        this._setOption('searchVisibleColumnsOnly', value);
    }

    @Input()
    get text(): string {
        return this._getOption('text');
    }
    set text(value: string) {
        this._setOption('text', value);
    }

    @Input()
    get visible(): boolean {
        return this._getOption('visible');
    }
    set visible(value: boolean) {
        this._setOption('visible', value);
    }

    @Input()
    get width(): number | string {
        return this._getOption('width');
    }
    set width(value: number | string) {
        this._setOption('width', value);
    }


    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() textChange: EventEmitter<string>;
    protected get _optionPath() {
        return 'searchPanel';
    }


    constructor(@SkipSelf() @Host() parentOptionHost: NestedOptionHost,
            @Host() optionHost: NestedOptionHost) {
        super();

        this._createEventEmitters([
            { emit: 'textChange' }
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
    DxoSearchPanelComponent
  ],
  exports: [
    DxoSearchPanelComponent
  ],
})
export class DxoSearchPanelModule { }
