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
import { DxoHtmlEditorImageUpload } from './base/html-editor-image-upload';

@Component({
    selector: 'dxo-image-upload',
    standalone: true,
    template: '',
    styles: [''],
    imports: [ DxIntegrationModule ],
    providers: [
        NestedOptionHost,
         {
            provide: NESTED_ITEM_TOKEN,
            useFactory: (component: DxoImageUploadComponent) => ({
                propertyName: 'imageUpload',
                className: 'DxoImageUploadComponent',
                component
            }),
            deps: [DxoImageUploadComponent],
         }
         ],
    inputs: [
        'fileUploaderOptions',
        'fileUploadMode',
        'tabs',
        'uploadDirectory',
        'uploadUrl'
    ]
})
export class DxoImageUploadComponent extends DxoHtmlEditorImageUpload implements OnDestroy, OnInit {

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
