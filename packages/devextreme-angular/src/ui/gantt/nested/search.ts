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
    selector: 'dxo-gantt-search',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoGanttSearchComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get editorOptions(): any {
        return this._getOption('editorOptions');
    }
    set editorOptions(value: any) {
        this._setOption('editorOptions', value);
    }

    @Input()
    get enabled(): boolean {
        return this._getOption('enabled');
    }
    set enabled(value: boolean) {
        this._setOption('enabled', value);
    }

    @Input()
    get mode(): "contains" | "startswith" | "equals" {
        return this._getOption('mode');
    }
    set mode(value: "contains" | "startswith" | "equals") {
        this._setOption('mode', value);
    }

    @Input()
    get searchExpr(): Array<(() => any) | string> | (() => any) | string {
        return this._getOption('searchExpr');
    }
    set searchExpr(value: Array<(() => any) | string> | (() => any) | string) {
        this._setOption('searchExpr', value);
    }

    @Input()
    get timeout(): number {
        return this._getOption('timeout');
    }
    set timeout(value: number) {
        this._setOption('timeout', value);
    }


    protected get _optionPath() {
        return 'search';
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
    DxoGanttSearchComponent
  ],
  exports: [
    DxoGanttSearchComponent
  ],
})
export class DxoGanttSearchModule { }
