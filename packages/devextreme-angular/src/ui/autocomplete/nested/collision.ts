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
    selector: 'dxo-autocomplete-collision',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoAutocompleteCollisionComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get x(): "fit" | "flip" | "flipfit" | "none" {
        return this._getOption('x');
    }
    set x(value: "fit" | "flip" | "flipfit" | "none") {
        this._setOption('x', value);
    }

    @Input()
    get y(): "fit" | "flip" | "flipfit" | "none" {
        return this._getOption('y');
    }
    set y(value: "fit" | "flip" | "flipfit" | "none") {
        this._setOption('y', value);
    }


    protected get _optionPath() {
        return 'collision';
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
    DxoAutocompleteCollisionComponent
  ],
  exports: [
    DxoAutocompleteCollisionComponent
  ],
})
export class DxoAutocompleteCollisionModule { }
