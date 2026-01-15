/* tslint:disable:max-line-length */

/* tslint:disable:use-input-property-decorator */

import {
    Component,
    NgModule,
    Host,
    SkipSelf
} from '@angular/core';





import {
    DxIntegrationModule,
    NestedOptionHost,
} from 'devextreme-angular/core';
import { DxiSuggestion } from './base/suggestion-dxi';

import { PROPERTY_TOKEN_suggestions } from 'devextreme-angular/core/tokens';

@Component({
    selector: 'dxi-suggestion',
    standalone: true,
    template: '',
    styles: [''],
    imports: [ DxIntegrationModule ],
    providers: [
        NestedOptionHost,
        {
           provide: PROPERTY_TOKEN_suggestions,
           useExisting: DxiSuggestionComponent,
        }
    ],
    inputs: [
        'text'
    ]
})
export class DxiSuggestionComponent extends DxiSuggestion {

    protected get _optionPath() {
        return 'suggestions';
    }


    constructor(@SkipSelf() @Host() parentOptionHost: NestedOptionHost,
            @Host() optionHost: NestedOptionHost) {
        super();
        parentOptionHost.setNestedOption(this);
        optionHost.setHost(this, this._fullOptionPath.bind(this));
    }



    ngOnDestroy() {
        this._deleteRemovedOptions(this._fullOptionPath());
    }

}

@NgModule({
  imports: [
    DxiSuggestionComponent
  ],
  exports: [
    DxiSuggestionComponent
  ],
})
export class DxiSuggestionModule { }
