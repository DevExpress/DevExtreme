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
    selector: 'dxo-file-manager-upload',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoFileManagerUploadComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get chunkSize(): number {
        return this._getOption('chunkSize');
    }
    set chunkSize(value: number) {
        this._setOption('chunkSize', value);
    }

    @Input()
    get maxFileSize(): number {
        return this._getOption('maxFileSize');
    }
    set maxFileSize(value: number) {
        this._setOption('maxFileSize', value);
    }


    protected get _optionPath() {
        return 'upload';
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
    DxoFileManagerUploadComponent
  ],
  exports: [
    DxoFileManagerUploadComponent
  ],
})
export class DxoFileManagerUploadModule { }
