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
    selector: 'dxo-file-manager-permissions',
    template: '',
    styles: [''],
    providers: [NestedOptionHost]
})
export class DxoFileManagerPermissionsComponent extends NestedOption implements OnDestroy, OnInit  {
    @Input()
    get copy(): boolean {
        return this._getOption('copy');
    }
    set copy(value: boolean) {
        this._setOption('copy', value);
    }

    @Input()
    get create(): boolean {
        return this._getOption('create');
    }
    set create(value: boolean) {
        this._setOption('create', value);
    }

    @Input()
    get delete(): boolean {
        return this._getOption('delete');
    }
    set delete(value: boolean) {
        this._setOption('delete', value);
    }

    @Input()
    get download(): boolean {
        return this._getOption('download');
    }
    set download(value: boolean) {
        this._setOption('download', value);
    }

    @Input()
    get move(): boolean {
        return this._getOption('move');
    }
    set move(value: boolean) {
        this._setOption('move', value);
    }

    @Input()
    get rename(): boolean {
        return this._getOption('rename');
    }
    set rename(value: boolean) {
        this._setOption('rename', value);
    }

    @Input()
    get upload(): boolean {
        return this._getOption('upload');
    }
    set upload(value: boolean) {
        this._setOption('upload', value);
    }


    protected get _optionPath() {
        return 'permissions';
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
    DxoFileManagerPermissionsComponent
  ],
  exports: [
    DxoFileManagerPermissionsComponent
  ],
})
export class DxoFileManagerPermissionsModule { }
