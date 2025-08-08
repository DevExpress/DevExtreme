/* tslint:disable:max-line-length */

/* tslint:disable:use-input-property-decorator */

import {
    Component,
    OnInit,
    OnDestroy,
    NgModule,
    Host,
    SkipSelf,
    Output,
    EventEmitter
} from '@angular/core';





import {
    NESTED_ITEM_TOKEN,
    DxIntegrationModule,
    NestedOptionHost,
} from 'devextreme-angular/core';
import { DxoSearchPanel } from './base/search-panel';

@Component({
    selector: 'dxo-search-panel',
    standalone: true,
    template: '',
    styles: [''],
    imports: [ DxIntegrationModule ],
    providers: [
        NestedOptionHost,
         {
            provide: NESTED_ITEM_TOKEN,
            useFactory: (component: DxoSearchPanelComponent) => ({
                propertyName: 'searchPanel',
                className: 'DxoSearchPanelComponent',
                component
            }),
            deps: [DxoSearchPanelComponent],
         }
         ],
    inputs: [
        'highlightCaseSensitive',
        'highlightSearchText',
        'placeholder',
        'searchVisibleColumnsOnly',
        'text',
        'visible',
        'width'
    ]
})
export class DxoSearchPanelComponent extends DxoSearchPanel implements OnDestroy, OnInit {

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() textChange: EventEmitter<string>;
    protected get _optionPath() {
        return 'searchPanel';
    }

    constructor(@SkipSelf() @Host() parentOptionHost: NestedOptionHost,
            @Host() optionHost: NestedOptionHost) {
        super();

        this._createEventEmitters([
            { emit: 'textChange' }
        ]);

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
    DxoSearchPanelComponent
  ],
  exports: [
    DxoSearchPanelComponent
  ],
})
export class DxoSearchPanelModule { }
