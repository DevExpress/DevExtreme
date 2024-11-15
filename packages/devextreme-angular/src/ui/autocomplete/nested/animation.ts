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




import { AnimationConfig } from 'devextreme/common/core/animation';

import {
    NestedOptionHost,
} from 'devextreme-angular/core';
import { NestedOption } from 'devextreme-angular/core';


@Component({
    selector: 'dxo-autocomplete-animation',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoAutocompleteAnimationComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get hide(): AnimationConfig {
        return this._getOption('hide');
    }
    set hide(value: AnimationConfig) {
        this._setOption('hide', value);
    }

    @Input()
    get show(): AnimationConfig {
        return this._getOption('show');
    }
    set show(value: AnimationConfig) {
        this._setOption('show', value);
    }


    protected get _optionPath() {
        return 'animation';
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
    DxoAutocompleteAnimationComponent
  ],
  exports: [
    DxoAutocompleteAnimationComponent
  ],
})
export class DxoAutocompleteAnimationModule { }
