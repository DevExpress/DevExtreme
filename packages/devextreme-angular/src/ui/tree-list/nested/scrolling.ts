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
    selector: 'dxo-tree-list-scrolling',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoTreeListScrollingComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get columnRenderingMode(): "standard" | "virtual" {
        return this._getOption('columnRenderingMode');
    }
    set columnRenderingMode(value: "standard" | "virtual") {
        this._setOption('columnRenderingMode', value);
    }

    @Input()
    get mode(): "standard" | "virtual" {
        return this._getOption('mode');
    }
    set mode(value: "standard" | "virtual") {
        this._setOption('mode', value);
    }

    @Input()
    get preloadEnabled(): boolean {
        return this._getOption('preloadEnabled');
    }
    set preloadEnabled(value: boolean) {
        this._setOption('preloadEnabled', value);
    }

    @Input()
    get renderAsync(): boolean {
        return this._getOption('renderAsync');
    }
    set renderAsync(value: boolean) {
        this._setOption('renderAsync', value);
    }

    @Input()
    get rowRenderingMode(): "standard" | "virtual" {
        return this._getOption('rowRenderingMode');
    }
    set rowRenderingMode(value: "standard" | "virtual") {
        this._setOption('rowRenderingMode', value);
    }

    @Input()
    get scrollByContent(): boolean {
        return this._getOption('scrollByContent');
    }
    set scrollByContent(value: boolean) {
        this._setOption('scrollByContent', value);
    }

    @Input()
    get scrollByThumb(): boolean {
        return this._getOption('scrollByThumb');
    }
    set scrollByThumb(value: boolean) {
        this._setOption('scrollByThumb', value);
    }

    @Input()
    get showScrollbar(): "always" | "never" | "onHover" | "onScroll" {
        return this._getOption('showScrollbar');
    }
    set showScrollbar(value: "always" | "never" | "onHover" | "onScroll") {
        this._setOption('showScrollbar', value);
    }

    @Input()
    get useNative(): boolean | "auto" {
        return this._getOption('useNative');
    }
    set useNative(value: boolean | "auto") {
        this._setOption('useNative', value);
    }


    protected get _optionPath() {
        return 'scrolling';
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
    DxoTreeListScrollingComponent
  ],
  exports: [
    DxoTreeListScrollingComponent
  ],
})
export class DxoTreeListScrollingModule { }
