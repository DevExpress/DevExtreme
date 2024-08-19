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
import { DxoHtmlEditorTableResizing } from './base/html-editor-table-resizing';


@Component({
    selector: 'dxo-table-resizing',
    template: '',
    styles: [''],
    providers: [NestedOptionHost],
    inputs: [
        'enabled',
        'minColumnWidth',
        'minRowHeight'
    ]
})
export class DxoTableResizingComponent extends DxoHtmlEditorTableResizing implements OnDestroy, OnInit  {

    protected get _optionPath() {
        return 'tableResizing';
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
    DxoTableResizingComponent
  ],
  exports: [
    DxoTableResizingComponent
  ],
})
export class DxoTableResizingModule { }
