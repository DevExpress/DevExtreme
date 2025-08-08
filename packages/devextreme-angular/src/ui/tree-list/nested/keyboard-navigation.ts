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




import { EnterKeyAction, EnterKeyDirection } from 'devextreme/common/grids';

import {
    NESTED_ITEM_TOKEN,
    DxIntegrationModule,
    NestedOptionHost,
} from 'devextreme-angular/core';
import { NestedOption } from 'devextreme-angular/core';

@Component({
    selector: 'dxo-tree-list-keyboard-navigation',
    standalone: true,
    template: '',
    styles: [''],
    imports: [ DxIntegrationModule ],
    providers: [
        NestedOptionHost,
         {
            provide: NESTED_ITEM_TOKEN,
            useFactory: (component: DxoTreeListKeyboardNavigationComponent) => ({
                propertyName: 'keyboardNavigation',
                className: 'DxoTreeListKeyboardNavigationComponent',
                component
            }),
            deps: [DxoTreeListKeyboardNavigationComponent],
         }
         ]
})
export class DxoTreeListKeyboardNavigationComponent extends NestedOption implements OnDestroy, OnInit {
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
    get enterKeyAction(): EnterKeyAction {
        return this._getOption('enterKeyAction');
    }
    set enterKeyAction(value: EnterKeyAction) {
        this._setOption('enterKeyAction', value);
    }

    @Input()
    get enterKeyDirection(): EnterKeyDirection {
        return this._getOption('enterKeyDirection');
    }
    set enterKeyDirection(value: EnterKeyDirection) {
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
  imports: [
    DxoTreeListKeyboardNavigationComponent
  ],
  exports: [
    DxoTreeListKeyboardNavigationComponent
  ],
})
export class DxoTreeListKeyboardNavigationModule { }
