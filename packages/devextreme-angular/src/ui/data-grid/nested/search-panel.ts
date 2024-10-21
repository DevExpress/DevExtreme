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
    selector: 'dxo-data-grid-search-panel',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoDataGridSearchPanelComponent extends NestedOption implements OnDestroy, OnInit  {
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


    protected get _optionPath() {
        return 'searchPanel';
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
    DxoDataGridSearchPanelComponent
  ],
  exports: [
    DxoDataGridSearchPanelComponent
  ],
})
export class DxoDataGridSearchPanelModule { }
