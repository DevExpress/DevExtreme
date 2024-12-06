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




import { ColumnChooserMode, ColumnChooserSearchConfig, ColumnChooserSelectionConfig } from 'devextreme/common/grids';
import { PositionConfig } from 'devextreme/common/core/animation';
import { SortOrder } from 'devextreme/common';

import {
    NestedOptionHost,
} from 'devextreme-angular/core';
import { NestedOption } from 'devextreme-angular/core';


@Component({
    selector: 'dxo-tree-list-column-chooser',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoTreeListColumnChooserComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get allowSearch(): boolean {
        return this._getOption('allowSearch');
    }
    set allowSearch(value: boolean) {
        this._setOption('allowSearch', value);
    }

    @Input()
    get container(): any | string | undefined {
        return this._getOption('container');
    }
    set container(value: any | string | undefined) {
        this._setOption('container', value);
    }

    @Input()
    get emptyPanelText(): string {
        return this._getOption('emptyPanelText');
    }
    set emptyPanelText(value: string) {
        this._setOption('emptyPanelText', value);
    }

    @Input()
    get enabled(): boolean {
        return this._getOption('enabled');
    }
    set enabled(value: boolean) {
        this._setOption('enabled', value);
    }

    @Input()
    get height(): number | string {
        return this._getOption('height');
    }
    set height(value: number | string) {
        this._setOption('height', value);
    }

    @Input()
    get mode(): ColumnChooserMode {
        return this._getOption('mode');
    }
    set mode(value: ColumnChooserMode) {
        this._setOption('mode', value);
    }

    @Input()
    get position(): PositionConfig | undefined {
        return this._getOption('position');
    }
    set position(value: PositionConfig | undefined) {
        this._setOption('position', value);
    }

    @Input()
    get search(): ColumnChooserSearchConfig {
        return this._getOption('search');
    }
    set search(value: ColumnChooserSearchConfig) {
        this._setOption('search', value);
    }

    @Input()
    get searchTimeout(): number {
        return this._getOption('searchTimeout');
    }
    set searchTimeout(value: number) {
        this._setOption('searchTimeout', value);
    }

    @Input()
    get selection(): ColumnChooserSelectionConfig {
        return this._getOption('selection');
    }
    set selection(value: ColumnChooserSelectionConfig) {
        this._setOption('selection', value);
    }

    @Input()
    get sortOrder(): SortOrder | undefined {
        return this._getOption('sortOrder');
    }
    set sortOrder(value: SortOrder | undefined) {
        this._setOption('sortOrder', value);
    }

    @Input()
    get title(): string {
        return this._getOption('title');
    }
    set title(value: string) {
        this._setOption('title', value);
    }

    @Input()
    get width(): number | string {
        return this._getOption('width');
    }
    set width(value: number | string) {
        this._setOption('width', value);
    }


    protected get _optionPath() {
        return 'columnChooser';
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
    DxoTreeListColumnChooserComponent
  ],
  exports: [
    DxoTreeListColumnChooserComponent
  ],
})
export class DxoTreeListColumnChooserModule { }
