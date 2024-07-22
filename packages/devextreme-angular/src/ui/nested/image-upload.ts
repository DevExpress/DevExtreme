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
    forwardRef,
    QueryList
} from '@angular/core';





import {
    NestedOptionHost,
} from 'devextreme-angular/core';
import { DxoHtmlEditorImageUpload } from './base/html-editor-image-upload';
import { DxiTabComponent } from './tab-dxi';


@Component({
    selector: 'dxo-image-upload',
    template: '',
    styles: [''],
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

    protected get _optionPath() {
        return 'imageUpload';
    }


    @ContentChildren(forwardRef(() => DxiTabComponent))
    get tabsChildren(): QueryList<DxiTabComponent> {
        return this._getOption('tabs');
    }
    set tabsChildren(value) {
        this.setChildren('tabs', value);
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
    DxoImageUploadComponent
  ],
  exports: [
    DxoImageUploadComponent
  ],
})
export class DxoImageUploadModule { }
