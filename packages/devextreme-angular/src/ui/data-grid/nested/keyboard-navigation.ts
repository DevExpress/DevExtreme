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
    selector: 'dxo-data-grid-keyboard-navigation',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoDataGridKeyboardNavigationComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get editOnKeyPress(): boolean {
        return this._getOption('editOnKeyPress');
    }
    set editOnKeyPress(value: boolean) {
        this._setOption('editOnKeyPress', value);
    }

    @Input()
    get enabled(): boolean {
        return this._getOption('enabled');
    }
    set enabled(value: boolean) {
        this._setOption('enabled', value);
    }

    @Input()
    get enterKeyAction(): "startEdit" | "moveFocus" {
        return this._getOption('enterKeyAction');
    }
    set enterKeyAction(value: "startEdit" | "moveFocus") {
        this._setOption('enterKeyAction', value);
    }

    @Input()
    get enterKeyDirection(): "none" | "column" | "row" {
        return this._getOption('enterKeyDirection');
    }
    set enterKeyDirection(value: "none" | "column" | "row") {
        this._setOption('enterKeyDirection', value);
    }


    protected get _optionPath() {
        return 'keyboardNavigation';
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
    DxoDataGridKeyboardNavigationComponent
  ],
  exports: [
    DxoDataGridKeyboardNavigationComponent
  ],
})
export class DxoDataGridKeyboardNavigationModule { }
