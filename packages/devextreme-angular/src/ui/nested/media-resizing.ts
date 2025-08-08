/* tslint:disable:max-line-length */

/* tslint:disable:use-input-property-decorator */

import {
    Component,
    OnInit,
    OnDestroy,
    NgModule,
    Host,
    SkipSelf
} from '@angular/core';





import {
    NESTED_ITEM_TOKEN,
    DxIntegrationModule,
    NestedOptionHost,
} from 'devextreme-angular/core';
import { DxoHtmlEditorMediaResizing } from './base/html-editor-media-resizing';

@Component({
    selector: 'dxo-media-resizing',
    standalone: true,
    template: '',
    styles: [''],
    imports: [ DxIntegrationModule ],
    providers: [
        NestedOptionHost,
         {
            provide: NESTED_ITEM_TOKEN,
            useFactory: (component: DxoMediaResizingComponent) => ({
                propertyName: 'mediaResizing',
                className: 'DxoMediaResizingComponent',
                component
            }),
            deps: [DxoMediaResizingComponent],
         }
         ],
    inputs: [
        'allowedTargets',
        'enabled'
    ]
})
export class DxoMediaResizingComponent extends DxoHtmlEditorMediaResizing implements OnDestroy, OnInit {

    protected get _optionPath() {
        return 'mediaResizing';
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
    DxoMediaResizingComponent
  ],
  exports: [
    DxoMediaResizingComponent
  ],
})
export class DxoMediaResizingModule { }
