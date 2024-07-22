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
    NestedOptionHost,
} from 'devextreme-angular/core';
import { DxoHtmlEditorMediaResizing } from './base/html-editor-media-resizing';


@Component({
    selector: 'dxo-media-resizing',
    template: '',
    styles: [''],
    providers: [NestedOptionHost],
    
    inputs: [
        'allowedTargets',
        'enabled'
    ]
})
export class DxoMediaResizingComponent extends DxoHtmlEditorMediaResizing implements OnDestroy, OnInit  {

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
  declarations: [
    DxoMediaResizingComponent
  ],
  exports: [
    DxoMediaResizingComponent
  ],
})
export class DxoMediaResizingModule { }
