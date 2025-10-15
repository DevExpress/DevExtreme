/* tslint:disable:max-line-length */

/* tslint:disable:use-input-property-decorator */

import {
    Component,
    OnInit,
    OnDestroy,
    NgModule,
    Host,
    SkipSelf,
    ContentChildren,
    QueryList
} from '@angular/core';





import {
    DxIntegrationModule,
    NestedOptionHost,
    CollectionNestedOption,
} from 'devextreme-angular/core';
import { DxoHtmlEditorImageUpload } from './base/html-editor-image-upload';

import {
    PROPERTY_TOKEN_tabs,
} from 'devextreme-angular/core/tokens';

@Component({
    selector: 'dxo-image-upload',
    standalone: true,
    template: '',
    styles: [''],
    imports: [ DxIntegrationModule ],
    providers: [NestedOptionHost],
    inputs: [
        'fileUploaderOptions',
        'fileUploadMode',
        'tabs',
        'uploadDirectory',
        'uploadUrl'
    ]
})
export class DxoImageUploadComponent extends DxoHtmlEditorImageUpload implements OnDestroy, OnInit  {
    @ContentChildren(PROPERTY_TOKEN_tabs)
    set _tabsContentChildren(value: QueryList<CollectionNestedOption>) {
        this.setChildren('tabs', value);
    }
    

    protected get _optionPath() {
        return 'imageUpload';
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
    DxoImageUploadComponent
  ],
  exports: [
    DxoImageUploadComponent
  ],
})
export class DxoImageUploadModule { }
