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
    selector: 'dxo-tree-map-group',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoTreeMapGroupComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get border(): Record<string, any> {
        return this._getOption('border');
    }
    set border(value: Record<string, any>) {
        this._setOption('border', value);
    }

    @Input()
    get color(): string {
        return this._getOption('color');
    }
    set color(value: string) {
        this._setOption('color', value);
    }

    @Input()
    get headerHeight(): number {
        return this._getOption('headerHeight');
    }
    set headerHeight(value: number) {
        this._setOption('headerHeight', value);
    }

    @Input()
    get hoverEnabled(): boolean {
        return this._getOption('hoverEnabled');
    }
    set hoverEnabled(value: boolean) {
        this._setOption('hoverEnabled', value);
    }

    @Input()
    get hoverStyle(): Record<string, any> {
        return this._getOption('hoverStyle');
    }
    set hoverStyle(value: Record<string, any>) {
        this._setOption('hoverStyle', value);
    }

    @Input()
    get label(): Record<string, any> {
        return this._getOption('label');
    }
    set label(value: Record<string, any>) {
        this._setOption('label', value);
    }

    @Input()
    get padding(): number {
        return this._getOption('padding');
    }
    set padding(value: number) {
        this._setOption('padding', value);
    }

    @Input()
    get selectionStyle(): Record<string, any> {
        return this._getOption('selectionStyle');
    }
    set selectionStyle(value: Record<string, any>) {
        this._setOption('selectionStyle', value);
    }


    protected get _optionPath() {
        return 'group';
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
    DxoTreeMapGroupComponent
  ],
  exports: [
    DxoTreeMapGroupComponent
  ],
})
export class DxoTreeMapGroupModule { }
